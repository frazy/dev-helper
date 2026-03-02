<template>
  <div class="tool-content">
    <h1>Hash 生成器</h1>

    <div class="input-area">
      <textarea v-model="input" placeholder="在此输入需要转换的大段文本..."></textarea>
    </div>

    <!-- 目标 Hash 比对 -->
    <div class="panel-block panel-block--accent compare-panel">
      <label class="compare-label">🎯 目标 Hash 比对 (Hash Compare)</label>
      <input type="text" v-model="targetHash" placeholder="贴入一段预期的 Hash，下方匹配的结果将自动亮起绿灯✅">
    </div>

    <!-- 结果展示 -->
    <div class="dual-pane">
      <div v-for="item in results" :key="item.label" class="control-group-vertical">
        <label>{{ item.label }}</label>
        <div class="result-display">
          <input type="text" :value="item.value" readonly placeholder="结果将实时显示"
            :class="{ 'match-success': isMatch(item.value) }">
          <CopyButton :text="item.value" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import CryptoJS from 'crypto-js'
import CopyButton from '../components/CopyButton.vue'

const DEBOUNCE_MS = 200

const input = ref('')
const targetHash = ref('')

let debounceTimer = null

const md5Lower = ref('')
const md5Upper = ref('')
const sha1 = ref('')
const sha256 = ref('')

const results = computed(() => [
  { label: 'MD5 (32位小写)', value: md5Lower.value },
  { label: 'MD5 (32位大写)', value: md5Upper.value },
  { label: 'SHA-1', value: sha1.value },
  { label: 'SHA-256', value: sha256.value },
])

const isMatch = (value) => {
  const target = targetHash.value.trim().toLowerCase()
  return target !== '' && value.toLowerCase() === target
}

const calculate = () => {
  const text = input.value
  if (text) {
    const md5Hash = CryptoJS.MD5(text).toString()
    md5Lower.value = md5Hash.toLowerCase()
    md5Upper.value = md5Hash.toUpperCase()
    sha1.value = CryptoJS.SHA1(text).toString()
    sha256.value = CryptoJS.SHA256(text).toString()
  } else {
    md5Lower.value = ''
    md5Upper.value = ''
    sha1.value = ''
    sha256.value = ''
  }
}

watch(input, () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(calculate, DEBOUNCE_MS)
})
</script>

<style scoped>
.input-area {
  margin-bottom: 25px;
}
.compare-panel {
  margin-bottom: 30px;
}
.compare-label {
  color: var(--primary-color);
  font-weight: 600;
  font-size: 15px;
  display: block;
  margin-bottom: 10px;
}
</style>
