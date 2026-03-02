<template>
  <aside class="sidebar">
    <div class="logo">Dev Helper</div>
    <nav class="tool-selector">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="tab-button"
        active-class="active"
      >
        <i :class="item.icon"></i>{{ item.label }}
      </router-link>
    </nav>
    <div class="sidebar-footer">v3.0 Vue Edition</div>
  </aside>
</template>

<script setup>
const navItems = [
  { to: '/password', icon: 'ph ph-key', label: '密码生成' },
  { to: '/hash', icon: 'ph ph-hash', label: 'Hash 加密' },
  { to: '/url', icon: 'ph ph-link', label: 'URL 编解码' },
  { to: '/json', icon: 'ph ph-brackets-curly', label: 'JSON 格式化' },
  { to: '/timestamp', icon: 'ph ph-clock', label: '时间戳转换' },
]
</script>

<style scoped>
.tab-button {
  text-decoration: none;
}
</style>
