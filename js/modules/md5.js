export const Md5Module = {
    render: () => `
        <div id="md5Generator" class="tool-content active">
            <h1>MD5 生成器</h1>
            <div class="input-area">
                <textarea id="md5Input" placeholder="在此输入需要转换的文本..."></textarea>
            </div>
            <div class="output-area">
                <div class="result-display">
                    <input type="text" id="md5Output" readonly placeholder="MD5 结果">
                    <button id="copyMd5" class="copy-btn">复制</button>
                </div>
                <button id="calculateMd5" class="primary-btn">计算 MD5</button>
            </div>
        </div>
    `,
    init: () => {
        const md5Input = document.getElementById('md5Input');
        const md5Output = document.getElementById('md5Output');
        const calculateMd5Btn = document.getElementById('calculateMd5');
        const copyMd5Btn = document.getElementById('copyMd5');

        const calculate = () => {
            const text = md5Input.value;
            if (text) {
                const hash = CryptoJS.MD5(text).toString();
                md5Output.value = hash;
            } else {
                md5Output.value = '';
            }
        };

        calculateMd5Btn.addEventListener('click', calculate);
        md5Input.addEventListener('input', calculate);
        copyMd5Btn.addEventListener('click', () => {
            if (md5Output.value) {
                navigator.clipboard.writeText(md5Output.value)
                    .then(() => alert('MD5 值已复制到剪贴板！'))
                    .catch(() => alert('复制失败，请手动复制。'));
            } else {
                alert('没有 MD5 值可供复制。');
            }
        });
    }
};
