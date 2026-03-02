import { ref } from 'vue'

const toasts = ref([])
let toastId = 0

export function useToast() {
    const showToast = (message, type = 'success') => {
        const id = ++toastId
        toasts.value.push({ id, message, type, show: false })

        // 触发进场动画
        setTimeout(() => {
            const toast = toasts.value.find(t => t.id === id)
            if (toast) toast.show = true
        }, 10)

        // 自动移除
        setTimeout(() => {
            const toast = toasts.value.find(t => t.id === id)
            if (toast) toast.show = false
            setTimeout(() => {
                toasts.value = toasts.value.filter(t => t.id !== id)
            }, 300)
        }, 2000)
    }

    return { toasts, showToast }
}
