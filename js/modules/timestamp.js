import { copyToClipboard, showToast } from '../../script.js';

export const TimestampModule = {
    render: () => `
        <div id="timestampConverter" class="tool-content active">
            <h1>时间戳转换</h1>
            <div class="control-group-vertical">
                <label>时间戳 (秒 / 毫秒)</label>
                <div class="item-display">
                    <input type="text" id="tsInput" placeholder="在此输入时间戳...">
                    <button id="btnTsToDate" class="copy-btn" style="border-radius:0; width:auto; padding: 0 15px; margin-left:0;">转日期 →</button>
                    <button id="copyTs" class="copy-btn">复制</button>
                </div>
            </div>

            <div class="control-group-vertical">
                <label>本地日期时间 (YYYY-MM-DD HH:MM:SS)</label>
                <div class="item-display">
                    <input type="text" id="dateInput" placeholder="YYYY/MM/DD HH:MM:SS">
                    <button id="btnDateToTs" class="copy-btn" style="border-radius:0; width:auto; padding: 0 15px; margin-left:0;">转时间戳 ←</button>
                    <button id="copyDate" class="copy-btn">复制</button>
                </div>
            </div>

            <div class="info-panel" style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 12px; font-size: 13px; color: var(--text-muted);">
                <p id="curTimeDisplay">当前时间戳: 加载中...</p>
            </div>
        </div>
    `,
    init: () => {
        const tsInput = document.getElementById('tsInput');
        const dateInput = document.getElementById('dateInput');
        const btnTsToDate = document.getElementById('btnTsToDate');
        const btnDateToTs = document.getElementById('btnDateToTs');
        const curTimeDisplay = document.getElementById('curTimeDisplay');

        // 定时更新显示当前时间
        const updateClock = () => {
            const now = Math.floor(Date.now() / 1000);
            curTimeDisplay.textContent = `当前北京时间: ${new Date().toLocaleString()} | 时间戳: ${now}`;
        };
        setInterval(updateClock, 1000);
        updateClock();

        // 初始填充
        const now = new Date();
        tsInput.value = Math.floor(now.getTime() / 1000);
        dateInput.value = now.toLocaleString();

        btnTsToDate.addEventListener('click', () => {
            let val = tsInput.value.trim();
            if (!val) return;
            let ts = parseInt(val);
            if (isNaN(ts)) {
                showToast('输入的时间戳无效', 'error');
                return;
            }
            // 补齐逻辑：如果是 10 位则是秒，13 位则是毫秒
            if (val.length === 10) ts = ts * 1000;
            const date = new Date(ts);
            dateInput.value = date.toLocaleString();
            showToast('转换成功');
        });

        btnDateToTs.addEventListener('click', () => {
            const val = dateInput.value.trim();
            if (!val) return;
            const date = new Date(val);
            if (date.toString() === 'Invalid Date') {
                showToast('日期格式不正确', 'error');
                return;
            }
            tsInput.value = Math.floor(date.getTime() / 1000);
            showToast('转换成功 (秒)');
        });

        document.getElementById('copyTs').addEventListener('click', () => copyToClipboard(tsInput.value));
        document.getElementById('copyDate').addEventListener('click', () => copyToClipboard(dateInput.value));
    }
};
