<template>
  <button class="copy-btn" @click="handleCopy">{{ label }}</button>
</template>

<script setup>
import { useClipboard } from '../composables/useClipboard.js'

const props = defineProps({
  text: { type: String, default: '' },
  label: { type: String, default: '复制' },
  successMsg: { type: String, default: '已复制到剪贴板' },
})

const { copyToClipboard } = useClipboard()

const handleCopy = () => {
  copyToClipboard(props.text, props.successMsg)
}
</script>
