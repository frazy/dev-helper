<template>
  <div class="tool-content url-page">
    <h1>URL 编解码</h1>

    <!-- 原始文本 -->
    <div class="input-section" style="position:relative;">
      <label class="field-label">原始文本 / 解码结果</label>
      <textarea v-model="rawText" placeholder="在此输入普通文本或URL..." class="url-textarea"></textarea>
      <div class="status-badge" :class="{ visible: lastAction === 'decode' }">[由解码生成]</div>
    </div>

    <!-- 操作栏 -->
    <div class="interaction-bar">
      <div class="auto-detect-hint">
        <div class="pulse-dot"></div>
        已启用智能双向监听检测
      </div>
      <div class="btn-row" style="margin-top:0;">
        <button class="secondary-btn" @click="handleEncode(false)">向下编码 ↓</button>
        <button class="secondary-btn" @click="handleDecode(false)">向上解码 ↑</button>
      </div>
    </div>

    <!-- 编码结果 -->
    <div class="output-section" style="position:relative;">
      <label class="field-label">编码后的结果</label>
      <textarea v-model="resultText" placeholder="这里显示处理后的内容..." class="url-textarea"></textarea>
      <div class="status-badge" :class="{ visible: lastAction === 'encode' }">[由编码生成]</div>

      <!-- 参数解析表 -->
      <div v-if="parsedParams.length" class="panel-block params-container">
        <div class="params-header">📋 Query 参数解析</div>
        <div class="params-body">
          <table class="params-table">
            <tr><th>Key</th><th>Value</th></tr>
            <tr v-for="(param, i) in parsedParams" :key="i">
              <td class="param-key">{{ param.key }}</td>
              <td class="param-value">{{ param.value }}</td>
            </tr>
          </table>
        </div>
      </div>

      <button class="primary-btn" @click="handleSmartCopy">{{ copyLabel }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useToast } from '../composables/useToast.js'
import { useClipboard } from '../composables/useClipboard.js'

const AUTO_DETECT_MS = 300

const { showToast } = useToast()
const { copyToClipboard } = useClipboard()

const rawText = ref('')
const resultText = ref('')
const lastAction = ref('')
const parsedParams = ref([])

const copyLabel = computed(() => lastAction.value === 'decode' ? '复制解码原文' : '复制编码结果')

const parseQueryParams = (urlStr) => {
  try {
    let queryStr = urlStr
    if (urlStr.includes('?')) queryStr = urlStr.split('?')[1]
    if (!queryStr || !queryStr.includes('=')) { parsedParams.value = []; return }
    const params = new URLSearchParams(queryStr)
    parsedParams.value = Array.from(params.entries()).map(([key, value]) => ({ key, value }))
  } catch {
    parsedParams.value = []
  }
}

const handleEncode = (silent = false) => {
  if (!rawText.value) { if (!silent) showToast('内容为空', 'error'); return }
  try {
    resultText.value = encodeURIComponent(rawText.value)
    lastAction.value = 'encode'
    if (!silent) showToast('已强制编码')
    parseQueryParams(rawText.value)
  } catch { if (!silent) showToast('编码失败', 'error') }
}

const handleDecode = (silent = false) => {
  const source = resultText.value || rawText.value
  if (!source) { if (!silent) showToast('内容为空', 'error'); return }
  try {
    rawText.value = decodeURIComponent(source)
    lastAction.value = 'decode'
    if (!silent) showToast('已强制解码')
    parseQueryParams(rawText.value)
  } catch { if (!silent) showToast('解码失败：格式不正确', 'error') }
}

const handleSmartCopy = () => {
  const text = lastAction.value === 'decode' ? rawText.value : resultText.value
  copyToClipboard(text, lastAction.value === 'decode' ? '已复制解码原文' : '已复制编码结果')
}

let rawTimer, resultTimer
watch(rawText, (val) => {
  clearTimeout(rawTimer)
  rawTimer = setTimeout(() => {
    const v = val.trim()
    if (v && /[^\x00-\x7F]/g.test(v)) handleEncode(true)
    else if (v) parseQueryParams(v)
    else { parsedParams.value = []; resultText.value = ''; lastAction.value = '' }
  }, AUTO_DETECT_MS)
})

watch(resultText, (val) => {
  clearTimeout(resultTimer)
  resultTimer = setTimeout(() => {
    const v = val.trim()
    if (v && /%[0-9A-Fa-f]{2}/.test(v)) handleDecode(true)
    else if (v) parseQueryParams(v)
    else { parsedParams.value = []; rawText.value = ''; lastAction.value = '' }
  }, AUTO_DETECT_MS)
})
</script>

<style scoped>
.url-textarea {
  min-height: 140px;
}
.interaction-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
}
.auto-detect-hint {
  font-size: 13px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}
.interaction-bar .secondary-btn {
  padding: 10px 20px;
}
.params-container {
  margin-top: 15px;
  padding: 0;
  overflow: hidden;
}
.params-header {
  padding: 12px 16px;
  background: rgba(255,255,255,0.05);
  font-size: 13px;
  color: var(--text-muted);
  border-bottom: 1px solid var(--card-border);
}
.params-body {
  padding: 16px;
  overflow-x: auto;
}
.params-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  text-align: left;
}
.params-table th {
  padding: 8px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.params-table td {
  padding: 8px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  font-family: monospace;
}
.param-key {
  color: var(--primary-color);
  width: 30%;
}
.param-value {
  word-break: break-all;
}
</style>
