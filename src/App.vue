<template>
  <div class="app-background"></div>
  <div class="container main-layout">
    <AppSidebar />
    <main class="content-area">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>

  <!-- 全局 Toast -->
  <div
    v-for="toast in toasts"
    :key="toast.id"
    :class="['toast', 'toast-' + toast.type, { show: toast.show }]"
  >
    {{ toast.message }}
  </div>
</template>

<script setup>
import AppSidebar from './components/AppSidebar.vue'
import { useToast } from './composables/useToast.js'

const { toasts } = useToast()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.98);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}
</style>
