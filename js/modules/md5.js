import { copyToClipboard } from '../../script.js';

// 简易防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export const Md5Module = {
    render: () => `
        <div id="hashGenerator" class="tool-content active">
            <h1>Hash 生成器</h1>
            <div class="input-area" style="margin-bottom: 25px;">
                <textarea id="hashInput" placeholder="在此输入需要转换的大段文本..."></textarea>
            </div>
            
            <div class="control-group-vertical" style="margin-bottom: 30px; background: rgba(0,0,0,0.2); padding: 25px; border-radius: 16px; border: 1px dashed var(--primary-color);">
                <label style="color: var(--primary-color); font-weight: 600; font-size: 15px;">🎯 目标 Hash 比对 (Hash Compare)</label>
                <input type="text" id="targetHashCompare" placeholder="贴入一段预期的 Hash，下方匹配的结果将自动亮起绿灯✅" style="margin-top: 10px;">
            </div>
            
            <div class="dual-pane">
                <div class="control-group-vertical">
                    <label>MD5 (32位小写)</label>
                    <div class="result-display">
                        <input type="text" id="hashMd5Lower" readonly placeholder="结果将实时显示">
                        <button id="copyHashMd5Lower" class="copy-btn">复制</button>
                    </div>
                </div>

                <div class="control-group-vertical">
                    <label>MD5 (32位大写)</label>
                    <div class="result-display">
                        <input type="text" id="hashMd5Upper" readonly placeholder="结果将实时显示">
                        <button id="copyHashMd5Upper" class="copy-btn">复制</button>
                    </div>
                </div>
                
                <div class="control-group-vertical">
                    <label>SHA-1</label>
                    <div class="result-display">
                        <input type="text" id="hashSha1" readonly placeholder="结果将实时显示">
                        <button id="copyHashSha1" class="copy-btn">复制</button>
                    </div>
                </div>

                <div class="control-group-vertical">
                    <label>SHA-256</label>
                    <div class="result-display">
                        <input type="text" id="hashSha256" readonly placeholder="结果将实时显示">
                        <button id="copyHashSha256" class="copy-btn">复制</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    init: () => {
        const hashInput = document.getElementById('hashInput');
        const targetHashCompare = document.getElementById('targetHashCompare');

        const inputs = {
            hashMd5Lower: document.getElementById('hashMd5Lower'),
            hashMd5Upper: document.getElementById('hashMd5Upper'),
            hashSha1: document.getElementById('hashSha1'),
            hashSha256: document.getElementById('hashSha256')
        };

        // 校验目标 Hash 是否匹配
        const checkMatch = () => {
            const target = targetHashCompare.value.trim().toLowerCase();
            Object.values(inputs).forEach(inputEl => {
                inputEl.classList.remove('match-success');
                if (target !== '' && inputEl.value.toLowerCase() === target) {
                    inputEl.classList.add('match-success');
                }
            });
        };

        const calculate = () => {
            const text = hashInput.value;
            if (text) {
                // MD5
                const md5Hash = CryptoJS.MD5(text).toString();
                inputs.hashMd5Lower.value = md5Hash.toLowerCase();
                inputs.hashMd5Upper.value = md5Hash.toUpperCase();

                // SHA-1
                inputs.hashSha1.value = CryptoJS.SHA1(text).toString();

                // SHA-256
                inputs.hashSha256.value = CryptoJS.SHA256(text).toString();
            } else {
                inputs.hashMd5Lower.value = '';
                inputs.hashMd5Upper.value = '';
                inputs.hashSha1.value = '';
                inputs.hashSha256.value = '';
            }
            checkMatch(); // 计算完后连带检查匹配度
        };

        // 使用防抖处理输入，防止大文本时的渲染卡顿
        const debouncedCalculate = debounce(calculate, 200);

        hashInput.addEventListener('input', () => {
            // UI 过渡态，在防抖延迟期间给用户反馈
            if (hashInput.value) {
                Object.values(inputs).forEach(el => {
                    if (!el.value) el.placeholder = "Calculating...";
                });
            }
            debouncedCalculate();
        });

        targetHashCompare.addEventListener('input', checkMatch);

        document.getElementById('copyHashMd5Lower').addEventListener('click', () => copyToClipboard(inputs.hashMd5Lower.value));
        document.getElementById('copyHashMd5Upper').addEventListener('click', () => copyToClipboard(inputs.hashMd5Upper.value));
        document.getElementById('copyHashSha1').addEventListener('click', () => copyToClipboard(inputs.hashSha1.value));
        document.getElementById('copyHashSha256').addEventListener('click', () => copyToClipboard(inputs.hashSha256.value));
    }
};
