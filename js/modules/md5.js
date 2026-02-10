import { copyToClipboard } from '../../script.js';

export const Md5Module = {
    render: () => `
        <div id="md5Generator" class="tool-content active">
            <h1>MD5 生成器</h1>
            <div class="input-area">
                <textarea id="md5Input" placeholder="在此输入需要转换的文本..."></textarea>
            </div>
            
            <div class="control-group-vertical">
                <label>32位小写</label>
                <div class="result-display">
                    <input type="text" id="md5Lower" readonly placeholder="结果将实时显示">
                    <button id="copyMd5Lower" class="copy-btn">复制</button>
                </div>
            </div>

            <div class="control-group-vertical">
                <label>32位大写</label>
                <div class="result-display">
                    <input type="text" id="md5Upper" readonly placeholder="结果将实时显示">
                    <button id="copyMd5Upper" class="copy-btn">复制</button>
                </div>
            </div>
        </div>
    `,
    init: () => {
        const md5Input = document.getElementById('md5Input');
        const md5Lower = document.getElementById('md5Lower');
        const md5Upper = document.getElementById('md5Upper');
        const copyLowerBtn = document.getElementById('copyMd5Lower');
        const copyUpperBtn = document.getElementById('copyMd5Upper');

        const calculate = () => {
            const text = md5Input.value;
            if (text) {
                const hash = CryptoJS.MD5(text).toString();
                md5Lower.value = hash.toLowerCase();
                md5Upper.value = hash.toUpperCase();
            } else {
                md5Lower.value = '';
                md5Upper.value = '';
            }
        };

        md5Input.addEventListener('input', calculate);
        copyLowerBtn.addEventListener('click', () => copyToClipboard(md5Lower.value));
        copyUpperBtn.addEventListener('click', () => copyToClipboard(md5Upper.value));
    }
};
