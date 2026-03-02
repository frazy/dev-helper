import { useToast } from './useToast.js'

export function useClipboard() {
    const { showToast } = useToast()

    const copyToClipboard = async (text, successMsg = '已复制到剪贴板') => {
        if (!text) {
            showToast('没有内容可供复制', 'error')
            return
        }
        try {
            await navigator.clipboard.writeText(text)
            showToast(successMsg)
        } catch {
            showToast('复制失败，请手动复制', 'error')
        }
    }

    return { copyToClipboard }
}
