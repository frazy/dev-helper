<template>
  <div class="tool-content">
    <h1>密码生成器</h1>

    <!-- 密码显示 -->
    <div class="password-display">
      <input type="text" :value="password" readonly placeholder="点击生成按钮">
      <CopyButton :text="password" />
    </div>

    <!-- 强度指示条 -->
    <div class="strength-bar-track">
      <div class="strength-bar-fill" :style="{ width: strength.width, backgroundColor: strength.color }"></div>
    </div>
    <div class="strength-row">
      <span class="strength-text" :style="{ color: strength.color }">强度: {{ strength.text }}</span>
      <div class="history-list">
        <span class="history-label" v-if="history.length">最近:</span>
        <div
          v-for="(pwd, i) in history"
          :key="i"
          class="history-badge"
          :title="'点击复制此密码'"
          @click="selectHistory(pwd)"
        >
          {{ pwd.substring(0, 5) }}...
        </div>
      </div>
    </div>

    <!-- 控制面板 -->
    <div class="panel-block">
      <!-- 长度滑块 -->
      <div class="control-row">
        <label>密码长度:</label>
        <input type="range" v-model.number="length" min="8" max="128" class="styled-range">
        <span class="length-value">{{ length }}</span>
      </div>

      <!-- 选项网格 -->
      <div class="options-grid">
        <div class="toggle-group" v-for="opt in options" :key="opt.key">
          <label class="toggle-switch">
            <input type="checkbox" v-model="opt.checked">
            <span class="slider"></span>
          </label>
          <span class="toggle-label" :style="opt.style || {}">{{ opt.label }}</span>
        </div>
      </div>

      <button class="primary-btn" @click="handleGenerate">立即生成密码</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import CopyButton from '../components/CopyButton.vue'
import { useClipboard } from '../composables/useClipboard.js'

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+~`|}{[]:;?><,./-='
const CONFUSING_REGEX = /[il1Lo0O]/g

const password = ref('')
const length = ref(20)
const history = ref([])
const strength = reactive({ width: '0%', color: '#ef4444', text: '-' })

const { copyToClipboard } = useClipboard()

const options = reactive([
  { key: 'upper', label: '包含大写字母 (A-Z)', checked: true },
  { key: 'lower', label: '包含小写字母 (a-z)', checked: true },
  { key: 'number', label: '包含数字 (0-9)', checked: true },
  { key: 'symbol', label: '包含符号 (!@#$%)', checked: false },
  { key: 'exclude', label: '排除易混淆字符 (1, l, 0, O)', checked: false, style: { color: '#fbbf24' } },
])

const getOption = (key) => options.find(o => o.key === key)

const evaluateStrength = (pwd) => {
  let score = 0
  if (pwd.length > 8) score++
  if (pwd.length > 12) score++
  if (pwd.length >= 20) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[a-z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++

  if (score >= 6) {
    Object.assign(strength, { width: '100%', color: '#10b981', text: '极强 (Excellent)' })
  } else if (score >= 4) {
    Object.assign(strength, { width: '66%', color: '#f59e0b', text: '中等 (Good)' })
  } else {
    Object.assign(strength, { width: '33%', color: '#ef4444', text: '弱 (Weak)' })
  }
}

const handleGenerate = () => {
  let chars = ''
  if (getOption('upper').checked) chars += UPPERCASE
  if (getOption('lower').checked) chars += LOWERCASE
  if (getOption('number').checked) chars += NUMBERS
  if (getOption('symbol').checked) chars += SYMBOLS
  if (getOption('exclude').checked) chars = chars.replace(CONFUSING_REGEX, '')

  if (!chars) {
    password.value = ''
    Object.assign(strength, { width: '0%', color: '#ef4444', text: '-' })
    return
  }

  let result = ''
  for (let i = 0; i < length.value; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  password.value = result
  evaluateStrength(result)

  if (result && !history.value.includes(result)) {
    history.value.unshift(result)
    if (history.value.length > 3) history.value.pop()
  }
}

const selectHistory = (pwd) => {
  password.value = pwd
  evaluateStrength(pwd)
  copyToClipboard(pwd, '已复制历史密码')
}

// 初始生成一次
handleGenerate()
</script>

<style scoped>
.strength-bar-track {
  height: 4px;
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 15px;
}
.strength-bar-fill {
  height: 100%;
  transition: all 0.3s ease;
}
.strength-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 30px;
}
.strength-text {
  transition: color 0.3s;
}
.history-list {
  display: flex;
  gap: 8px;
  align-items: center;
}
.history-label {
  opacity: 0.5;
  margin-right: 5px;
}
.control-row {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}
.control-row label {
  width: 120px;
  color: var(--text-muted);
}
.control-row .styled-range {
  flex: 1;
  margin: 0 20px;
}
.length-value {
  font-family: monospace;
  font-size: 18px;
  font-weight: bold;
  color: var(--primary-color);
  width: 40px;
  text-align: right;
}
.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.options-grid .toggle-group:last-child {
  grid-column: 1 / -1;
  margin-top: 10px;
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.05);
}
</style>
