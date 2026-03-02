<template>
  <div class="tool-content json-page">
    <h1>JSON 格式化</h1>

    <div class="json-dual-pane">
      <!-- 输入面板 -->
      <div class="json-pane">
        <div class="section-header">
          <label class="pane-label">原始文本 / 编辑区</label>
          <button class="action-pill" @click="handlePasteAndFormat">
            一键粘贴并格式化 <i class="ph ph-clipboard"></i>
          </button>
        </div>
        <textarea
          v-model="inputJson"
          placeholder="在此输入原始 JSON..."
          class="json-editor"
          :style="inputBorderError ? { borderColor: '#ef4444' } : {}"
        ></textarea>

        <div v-if="errorHint" class="error-hint">
          <i class="ph ph-warning"></i> 解析错误：<span v-html="errorHint"></span>
        </div>

        <div class="btn-row">
          <button class="secondary-btn" @click="handleFormat">格式化 →</button>
          <button class="secondary-btn" @click="handleMinify">压缩内容</button>
        </div>
      </div>

      <!-- 输出面板 -->
      <div class="json-pane">
        <div class="section-header">
          <label class="pane-label">处理结果 (只读 / 语法高亮)</label>
        </div>
        <div class="json-output">
          <pre><code ref="codeRef" class="language-json">{{ outputJson || '输出结果将在这里显示' }}</code></pre>
        </div>
        <div class="btn-row">
          <button class="success-btn" style="flex:2" @click="handleCopyOutput">复制结果</button>
          <button class="danger-btn" style="flex:1" @click="handleClear">清空</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import 'highlight.js/styles/atom-one-dark.css'
import { useToast } from '../composables/useToast.js'
import { useClipboard } from '../composables/useClipboard.js'

hljs.registerLanguage('json', json)

const { showToast } = useToast()
const { copyToClipboard } = useClipboard()

const inputJson = ref('')
const outputJson = ref('')
const errorHint = ref('')
const codeRef = ref(null)
const inputBorderError = ref(false)

const highlight = async () => {
  await nextTick()
  if (codeRef.value) {
    codeRef.value.removeAttribute('data-highlighted')
    hljs.highlightElement(codeRef.value)
  }
}

const tryParse = (action) => {
  errorHint.value = ''
  inputBorderError.value = false

  if (!inputJson.value.trim()) {
    outputJson.value = ''
    highlight()
    return
  }

  try {
    const obj = JSON.parse(inputJson.value)
    if (action === 'format') {
      outputJson.value = JSON.stringify(obj, null, 4)
      showToast('已完成 JSON 格式化')
    } else {
      outputJson.value = JSON.stringify(obj)
      showToast('已完成内容压缩')
    }
    highlight()
  } catch (e) {
    inputBorderError.value = true
    let errMsg = e.message
    const posMatch = errMsg.match(/at position (\d+)/)
    if (posMatch) {
      const pos = parseInt(posMatch[1])
      const lines = inputJson.value.substring(0, pos).split('\n')
      errMsg += '<br><strong>-> 发生在 第 ' + lines.length + ' 行，第 ' + (lines[lines.length - 1].length + 1) + ' 列 左右</strong>'
    }
    errorHint.value = errMsg
    outputJson.value = '// 解析失败，请检查语法错误。\n// ' + e.message
    highlight()
    showToast('JSON 格式有误', 'error')
  }
}

const handleFormat = () => tryParse('format')
const handleMinify = () => tryParse('minify')

const handlePasteAndFormat = async () => {
  try {
    const text = await navigator.clipboard.readText()
    if (text) {
      inputJson.value = text
      tryParse('format')
    } else {
      showToast('剪贴板为空', 'error')
    }
  } catch {
    showToast('无法读取剪贴板，请检查浏览器权限', 'error')
  }
}

const handleClear = () => {
  inputJson.value = ''
  outputJson.value = ''
  errorHint.value = ''
  inputBorderError.value = false
  highlight()
  showToast('已清空')
}

const handleCopyOutput = () => copyToClipboard(outputJson.value)
</script>

<style scoped>
/* JSON 页面撑满整个内容区高度 */
.json-page {
  display: flex;
  flex-direction: column;
}

.json-dual-pane {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  flex: 1;
  min-height: 0;
}

.json-pane {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* 编辑区和输出区撑满可用空间 */
.json-editor {
  flex: 1;
  min-height: 200px;
  font-size: 14px;
  resize: none;
}

.json-output {
  flex: 1;
  min-height: 200px;
  background: #282c34;
  border-radius: 14px;
  border: 1px solid var(--card-border);
  overflow-y: auto;
  padding: 15px;
}
.json-output pre {
  margin: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
}
.json-output code {
  background: transparent;
  color: #abb2bf;
}

@media (max-width: 1000px) {
  .json-dual-pane {
    grid-template-columns: 1fr;
  }
}
</style>
