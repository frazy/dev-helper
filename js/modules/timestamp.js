import { copyToClipboard, showToast } from '../../script.js';

export const TimestampModule = {
    render: () => `
        <div id="timestampConverter" class="tool-content active">
            <h1>精准时间转换</h1>
            
            <div class="info-panel" style="background: rgba(0,0,0,0.2); padding: 30px; border-radius: 16px; border: 1px solid var(--card-border); text-align: center; margin-bottom: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
                <div style="font-size: 14px; color: var(--text-muted); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 2px;">实时北京时间</div>
                <div id="curTimeDisplay" style="font-family: 'JetBrains Mono', monospace; font-size: 26px; color: var(--success); font-weight: 700; font-variant-numeric: tabular-nums;">
                    加载中...
                </div>
                <div id="curTsDisplay" style="font-family: 'JetBrains Mono', monospace; font-size: 14px; color: var(--text-muted); margin-top: 10px;">
                    -
                </div>
            </div>

            <div class="dual-pane" style="gap: 20px; align-items: stretch;">
                <div class="control-group-vertical" style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);">
                    <label class="pane-label" style="display:flex; justify-content:space-between;">
                        <span>时间戳 (秒 s / 毫秒 ms)</span>
                        <span style="color:var(--primary-color); font-size:11px;">自动监听输入</span>
                    </label>
                    <div class="item-display" style="margin-bottom:0;">
                        <input type="text" id="tsInput" placeholder="输入 10 或 13 位数字...">
                        <button id="copyTs" class="copy-btn">复制</button>
                    </div>
                    <div id="relativeTimeDisplay" style="margin-top:12px; font-size: 13px; color: var(--text-muted); text-align: right; min-height: 20px;"></div>
                </div>

                <div class="control-group-vertical" style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);">
                    <label class="pane-label" style="display:flex; justify-content:space-between;">
                        <span>格式化日期 (YYYY-MM-DD HH:MM:SS)</span>
                        <span style="color:var(--primary-color); font-size:11px;">自动监听输入</span>
                    </label>
                    <div class="item-display" style="margin-bottom:0;">
                        <input type="text" id="dateInput" placeholder="2024-01-01 12:00:00">
                        <button id="copyDate" class="copy-btn">复制</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    init: () => {
        const tsInput = document.getElementById('tsInput');
        const dateInput = document.getElementById('dateInput');
        const relativeTimeDisplay = document.getElementById('relativeTimeDisplay');
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
            return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s + '.' + ms;
        };

        const getRelativeTime = (timestamp) => {
            const now = Date.now();
            const diffMs = timestamp - now;
            const diffSec = Math.round(diffMs / 1000);
            const diffMin = Math.round(diffSec / 60);
            const diffHr = Math.round(diffMin / 60);
            const diffDay = Math.round(diffHr / 24);

            const absDay = Math.abs(diffDay);
            const absHr = Math.abs(diffHr);
            const absMin = Math.abs(diffMin);
            const absSec = Math.abs(diffSec);

            let str = '';
            if (absDay > 0) str = absDay + ' 天';
            else if (absHr > 0) str = absHr + ' 小时';
            else if (absMin > 0) str = absMin + ' 分钟';
            else str = absSec + ' 秒';

            return diffMs > 0 ? ('(' + str + ' 后)') : ('(' + str + ' 前)');
        };

        const updateRelativeTime = () => {
            const ts = parseInt(tsInput.value);
            if (!isNaN(ts)) {
                // 判断秒还是毫秒
                const msTs = ts < 100000000000 ? ts * 1000 : ts;
                relativeTimeDisplay.textContent = getRelativeTime(msTs);
                // 颜色提示
                relativeTimeDisplay.style.color = (msTs > Date.now()) ? 'var(--primary-color)' : 'var(--text-muted)';
            } else {
                relativeTimeDisplay.textContent = '';
            }
        };

        const updateClock = () => {
            const now = new Date();
            const formatted = formatFullDate(now);
            curTimeDisplay.textContent = formatted;
            curTsDisplay.textContent = 'Timestamp (MS): ' + now.getTime() + ' | (S): ' + Math.floor(now.getTime() / 1000);

            // 实时更新相对时间
            updateRelativeTime();
        };
        const intervalId = setInterval(updateClock, 1000); // 1秒一次足以
        updateClock();

        // 初始填充
        const initialDate = new Date();
        tsInput.value = initialDate.getTime();
        dateInput.value = formatFullDate(initialDate);

        // 监听时间戳输入
        tsInput.addEventListener('input', () => {
            const val = tsInput.value.trim();
            if (!val) {
                dateInput.value = '';
                return;
            }
            let ts = parseInt(val);
            if (isNaN(ts)) return;

            // 判断是秒还是毫秒
            if (ts < 100000000000) ts = ts * 1000;
            const res = formatFullDate(new Date(ts));
            if (res) {
                dateInput.value = res;
                updateRelativeTime();
                tsInput.style.borderColor = 'var(--primary-color)';
            } else {
                tsInput.style.borderColor = '#ef4444';
            }
        });

        // 监听日期输入，修复不同环境下的解析格式问题
        dateInput.addEventListener('input', () => {
            const val = dateInput.value.trim();
            if (!val) {
                tsInput.value = '';
                return;
            }
            // 兼容 Date 解析的格式，统一将 '-' 替换为 '/'
            const dStr = val.replace(/-/g, '/');
            const date = new Date(dStr);
            if (!isNaN(date.getTime())) {
                tsInput.value = date.getTime();
                updateRelativeTime();
                dateInput.style.borderColor = 'var(--primary-color)';
            } else {
                dateInput.style.borderColor = '#ef4444';
            }
        });

        // 恢复失焦时的边框颜色
        tsInput.addEventListener('blur', () => tsInput.style.borderColor = '');
        dateInput.addEventListener('blur', () => dateInput.style.borderColor = '');

        document.getElementById('copyTs').addEventListener('click', () => copyToClipboard(tsInput.value));
        document.getElementById('copyDate').addEventListener('click', () => copyToClipboard(dateInput.value));
    }
};
