<template>
  <div class="tool-content">
    <h1>精准时间转换</h1>

    <!-- 实时时钟 -->
    <div class="panel-block clock-panel">
      <div class="clock-label">实时北京时间</div>
      <div class="clock-time">{{ clockDisplay }}</div>
      <div class="clock-ts">
        Timestamp (MS): {{ clockMs }} | (S): {{ clockS }}
      </div>
    </div>

    <!-- 双向转换 -->
    <div class="dual-pane">
      <!-- 时间戳输入 -->
      <div class="panel-block ts-pane">
        <div class="section-header">
          <label class="pane-label">时间戳 (秒 S / 毫秒 MS)</label>
          <span class="auto-badge">自动监听输入</span>
        </div>
        <div class="result-display">
          <input type="text" v-model="timestampInput" placeholder="输入时间戳...">
          <CopyButton :text="timestampInput" />
        </div>
        <div v-if="relativeFromTs" class="relative-hint" :style="{ color: relativeFromTs.color }">
          ({{ relativeFromTs.text }})
        </div>
      </div>

      <!-- 日期输入 -->
      <div class="panel-block ts-pane">
        <div class="section-header">
          <label class="pane-label">格式化日期 (YYYY-MM-DD HH:MM:SS)</label>
          <span class="auto-badge">自动监听输入</span>
        </div>
        <div class="result-display">
          <input type="text" v-model="dateInput" placeholder="输入日期时间...">
          <CopyButton :text="dateInput" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import CopyButton from '../components/CopyButton.vue'

const CLOCK_INTERVAL_MS = 50

const clockDisplay = ref('')
const clockMs = ref('')
const clockS = ref('')

const timestampInput = ref('')
const dateInput = ref('')
const relativeFromTs = ref(null)

let clockTimer = null
let isUpdatingFromTs = false
let isUpdatingFromDate = false

const pad = (n, len = 2) => String(n).padStart(len, '0')

const formatFullDate = (d) => {
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' +
    pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()) + '.' +
    pad(d.getMilliseconds(), 3)
}

const getRelativeTime = (date) => {
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const absDiff = Math.abs(diffMs)
  const suffix = diffMs >= 0 ? '后' : '前'
  const color = diffMs >= 0 ? '#10b981' : '#f59e0b'

  const minutes = Math.floor(absDiff / 60000)
  const hours = Math.floor(absDiff / 3600000)
  const days = Math.floor(absDiff / 86400000)

  let text = ''
  if (days > 0) text = days + ' 天 ' + suffix
  else if (hours > 0) text = hours + ' 小时 ' + suffix
  else if (minutes > 0) text = minutes + ' 分钟 ' + suffix
  else text = '刚刚'

  return { text, color }
}

const updateClock = () => {
  const now = new Date()
  clockDisplay.value = formatFullDate(now)
  clockMs.value = String(now.getTime())
  clockS.value = String(Math.floor(now.getTime() / 1000))
}

// 时间戳 → 日期
watch(timestampInput, (val) => {
  if (isUpdatingFromDate) return
  const trimmed = val.trim()
  if (!trimmed || isNaN(Number(trimmed))) {
    dateInput.value = ''
    relativeFromTs.value = null
    return
  }

  isUpdatingFromTs = true
  let ts = Number(trimmed)
  // 自动判断秒/毫秒
  if (ts < 1e12) ts *= 1000
  const d = new Date(ts)

  if (isNaN(d.getTime())) {
    dateInput.value = '无效时间戳'
    relativeFromTs.value = null
  } else {
    dateInput.value = formatFullDate(d)
    relativeFromTs.value = getRelativeTime(d)
  }

  setTimeout(() => { isUpdatingFromTs = false }, 50)
})

// 日期 → 时间戳
watch(dateInput, (val) => {
  if (isUpdatingFromTs) return
  const trimmed = val.trim()
  if (!trimmed) {
    timestampInput.value = ''
    relativeFromTs.value = null
    return
  }

  isUpdatingFromDate = true
  const d = new Date(trimmed.replace(/-/g, '/'))

  if (isNaN(d.getTime())) {
    timestampInput.value = '无效日期'
    relativeFromTs.value = null
  } else {
    timestampInput.value = String(d.getTime())
    relativeFromTs.value = getRelativeTime(d)
  }

  setTimeout(() => { isUpdatingFromDate = false }, 50)
})

onMounted(() => {
  updateClock()
  clockTimer = setInterval(updateClock, CLOCK_INTERVAL_MS)
})

onUnmounted(() => {
  clearInterval(clockTimer)
})
</script>

<style scoped>
.clock-panel {
  text-align: center;
  margin-bottom: 35px;
}
.clock-label {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 10px;
}
.clock-time {
  font-size: 28px;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: var(--primary-color);
  margin-bottom: 8px;
  letter-spacing: 2px;
}
.clock-ts {
  font-size: 13px;
  color: var(--text-muted);
  font-family: monospace;
}
.ts-pane {
  padding: 20px;
}
.auto-badge {
  font-size: 11px;
  color: var(--primary-color);
  opacity: 0.8;
}
.relative-hint {
  font-size: 13px;
  margin-top: 8px;
  text-align: right;
}
</style>
