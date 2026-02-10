import { PasswordModule } from './js/modules/password.js';
import { Md5Module } from './js/modules/md5.js';
import { UrlModule } from './js/modules/url.js';
import { JsonModule } from './js/modules/json.js';
import { TimestampModule } from './js/modules/timestamp.js';

const modules = {
    passwordGenerator: PasswordModule,
    md5Generator: Md5Module,
    urlEncoderDecoder: UrlModule,
    jsonFormatter: JsonModule,
    timestampConverter: TimestampModule
};

const appContent = document.getElementById('app-content');
const tabButtons = document.querySelectorAll('.tab-button');

// 全局 Toast 系统
export function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // 动画触发
    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// 统一复制函数
export function copyToClipboard(text, successMsg = '已复制到剪贴板') {
    if (!text) {
        showToast('没有内容可供复制', 'error');
        return;
    }
    navigator.clipboard.writeText(text)
        .then(() => showToast(successMsg))
        .catch(() => showToast('复制失败，请手动复制', 'error'));
}

function navigate(moduleId) {
    const module = modules[moduleId];
    if (!module) return;

    // 渲染 UI
    appContent.innerHTML = module.render();

    // 初始化逻辑
    module.init();

    // 更新 Tab 状态
    tabButtons.forEach(btn => {
        if (btn.dataset.tab === moduleId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// 绑定 Tab 点击事件
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;
        navigate(targetTab);
    });
});

// 初始加载
document.addEventListener('DOMContentLoaded', () => {
    navigate('passwordGenerator');
});
