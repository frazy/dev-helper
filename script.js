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
