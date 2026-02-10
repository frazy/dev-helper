import { copyToClipboard, showToast } from '../../script.js';

export const TimestampModule = {
    render: () => `
        <div id="timestampConverter" class="tool-content active">
            <h1>精准时间转换</h1>
            <div class="control-group-vertical">
                <label>时间戳 (秒 s / 毫秒 ms)</label>
                <div class="item-display">
                    <input type="text" id="tsInput" placeholder="输入 10 位或 13 位时间戳...">
                    <button id="btnTsToDate" class="copy-btn" style="border-radius:0; width:auto; padding: 0 15px; margin-left:0; background: var(--success);">转换 →</button>
                    <button id="copyTs" class="copy-btn">复制</button>
                </div>
            </div>

            <div class="control-group-vertical">
                <label>格式化日期 (YYYY-MM-DD HH:MM:SS.sss)</label>
                <div class="item-display">
                    <input type="text" id="dateInput" placeholder="2024-02-10 16:00:00.000">
                    <button id="btnDateToTs" class="copy-btn" style="border-radius:0; width:auto; padding: 0 15px; margin-left:0; background: var(--success);">取得时间戳 ←</button>
                    <button id="copyDate" class="copy-btn">复制</button>
                </div>
            </div>

            <div class="info-panel" style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px; margin-top:20px;">
                <p id="curTimeDisplay" style="font-family: monospace; font-size: 14px; text-align: center; color: var(--text-main);">当前时间: 加载中...</p>
            </div>
        </div>
    `,
    init: () => {
        const tsInput = document.getElementById('tsInput');
        const dateInput = document.getElementById('dateInput');
        const btnTsToDate = document.getElementById('btnTsToDate');
        const btnDateToTs = document.getElementById('btnDateToTs');
        const curTimeDisplay = document.getElementById('curTimeDisplay');

        // 精确格式化函数
        const formatFullDate = (date) => {
            const pad = (n, len = 2) => String(n).padStart(len, '0');
            const Y = date.getFullYear();
            const M = pad(date.getMonth() + 1);
            const D = pad(date.getDate());
            const h = pad(date.getHours());
            const m = pad(date.getMinutes());
            const s = pad(date.getSeconds());
            const ms = pad(date.getMilliseconds(), 3);
            return `${Y}-${M}-${D} ${h}:${m}:${s}.${ms}`;
        };

        const updateClock = () => {
            const now = new Date();
            const tsS = Math.floor(now.getTime() / 1000);
            const tsMS = now.getTime();
            curTimeDisplay.innerHTML = `
                <div style="margin-bottom:8px">当前时间: <span style="color:var(--success)">${formatFullDate(now)}</span></div>
                <div style="font-size:12px; color:var(--text-muted)">秒: ${tsS} | 毫秒: ${tsMS}</div>
            `;
        };
        setInterval(updateClock, 100);
        updateClock();

        // 初始填充
        const initialDate = new Date();
        tsInput.value = initialDate.getTime(); // 默认毫秒，更精确
        dateInput.value = formatFullDate(initialDate);

        btnTsToDate.addEventListener('click', () => {
            const val = tsInput.value.trim();
            if (!val) return;
            let ts = parseInt(val);
            if (isNaN(ts)) {
                showToast('输入的时间戳无效', 'error');
                return;
            }
            // 自动补全位：小于 1000亿 通常是秒
            if (ts < 100000000000) ts = ts * 1000;
            dateInput.value = formatFullDate(new Date(ts));
            showToast('已格式化');
        });

        btnDateToTs.addEventListener('click', () => {
            const val = dateInput.value.trim();
            if (!val) return;
            // 兼容多种输入格式
            let dateVal = val.replace(/-/g, '/');
            const date = new Date(dateVal);
            if (date.toString() === 'Invalid Date') {
                showToast('日期格式不正确 (建议: YYYY-MM-DD HH:MM:SS.sss)', 'error');
                return;
            }
            // 默认返回毫秒戳，更符合现代开发需求
            tsInput.value = date.getTime();
            showToast('已解析为毫秒戳');
        });

        document.getElementById('copyTs').addEventListener('click', () => copyToClipboard(tsInput.value));
        document.getElementById('copyDate').addEventListener('click', () => copyToClipboard(dateInput.value));
    }
};
