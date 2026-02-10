import { copyToClipboard, showToast } from '../../script.js';

export const TimestampModule = {
    render: () => `
        <div id="timestampConverter" class="tool-content active">
            <h1>精准时间转换</h1>
            
            <div class="control-group-vertical" style="margin-bottom: 30px;">
                <label class="pane-label">时间戳 (秒 s / 毫秒 ms)</label>
                <div class="item-display">
                    <input type="text" id="tsInput" placeholder="输入 10 或 13 位数字...">
                    <button id="btnTsToDate" class="copy-btn" style="border-radius:0; width:120px; background: var(--success); font-weight:700;">转换 →</button>
                    <button id="copyTs" class="copy-btn">复制</button>
                </div>
            </div>

            <div class="control-group-vertical" style="margin-bottom: 40px;">
                <label class="pane-label">格式化日期 (YYYY-MM-DD HH:MM:SS.sss)</label>
                <div class="item-display">
                    <input type="text" id="dateInput" placeholder="2024-01-01 12:00:00.000">
                    <button id="btnDateToTs" class="copy-btn" style="border-radius:0; width:120px; background: var(--success); font-weight:700;">解析 ←</button>
                    <button id="copyDate" class="copy-btn">复制</button>
                </div>
            </div>

            <div class="info-panel" style="background: rgba(0,0,0,0.2); padding: 30px; border-radius: 16px; border: 1px solid var(--card-border); text-align: center;">
                <div style="font-size: 14px; color: var(--text-muted); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 2px;">实时北京时间</div>
                <div id="curTimeDisplay" style="font-family: 'JetBrains Mono', monospace; font-size: 20px; color: var(--success); font-weight: 700; font-variant-numeric: tabular-nums;">
                    加载中...
                </div>
                <div id="curTsDisplay" style="font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--text-muted); margin-top: 10px;">
                    -
                </div>
            </div>
        </div>
    `,
    init: () => {
        const tsInput = document.getElementById('tsInput');
        const dateInput = document.getElementById('dateInput');
        const btnTsToDate = document.getElementById('btnTsToDate');
        const btnDateToTs = document.getElementById('btnDateToTs');
        const curTimeDisplay = document.getElementById('curTimeDisplay');
        const curTsDisplay = document.getElementById('curTsDisplay');

        // 精确格式化函数
        const formatFullDate = (date) => {
            if (!(date instanceof Date) || isNaN(date.getTime())) return null;
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
            const formatted = formatFullDate(now);
            curTimeDisplay.textContent = formatted;
            curTsDisplay.textContent = `Timestamp (MS): ${now.getTime()} | (S): ${Math.floor(now.getTime() / 1000)}`;
        };
        setInterval(updateClock, 100);
        updateClock();

        // 初始填充
        const initialDate = new Date();
        tsInput.value = initialDate.getTime();
        dateInput.value = formatFullDate(initialDate);

        btnTsToDate.addEventListener('click', () => {
            const val = tsInput.value.trim();
            if (!val) {
                showToast('请输入时间戳', 'error');
                return;
            }
            let ts = parseInt(val);
            if (isNaN(ts)) {
                showToast('输入的时间戳格式不正确', 'error');
                return;
            }
            // 自动补全：判断是秒还是毫秒
            if (ts < 100000000000) ts = ts * 1000;
            const res = formatFullDate(new Date(ts));
            if (!res) {
                showToast('无法解析该时间戳', 'error');
                return;
            }
            dateInput.value = res;
            showToast('转换成功');
        });

        btnDateToTs.addEventListener('click', () => {
            const val = dateInput.value.trim();
            if (!val) {
                showToast('请输入日期时间', 'error');
                return;
            }
            // 宽容解析
            const dStr = val.replace(/-/g, '/');
            const date = new Date(dStr);
            if (isNaN(date.getTime())) {
                showToast('日期格式不可识别', 'error');
                return;
            }
            tsInput.value = date.getTime();
            showToast('转换成功 (毫秒)');
        });

        document.getElementById('copyTs').addEventListener('click', () => copyToClipboard(tsInput.value));
        document.getElementById('copyDate').addEventListener('click', () => copyToClipboard(dateInput.value));
    }
};
