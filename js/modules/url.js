export const UrlModule = {
    render: () => `
        <div id="urlEncoderDecoder" class="tool-content active">
            <h1>URL 编码/解码</h1>
            <div class="input-area">
                <textarea id="urlInput" placeholder="输入 URL 文本..."></textarea>
            </div>
            <div class="button-group">
                <button id="encodeUrl" class="secondary-btn">编码</button>
                <button id="decodeUrl" class="secondary-btn">解码</button>
            </div>
            <div class="output-area">
                <textarea id="urlOutput" readonly placeholder="编码/解码后的结果"></textarea>
                <button id="copyUrlOutput" class="primary-btn">复制结果</button>
            </div>
        </div>
    `,
    init: () => {
        const urlInput = document.getElementById('urlInput');
        const urlOutput = document.getElementById('urlOutput');
        const encodeUrlBtn = document.getElementById('encodeUrl');
        const decodeUrlBtn = document.getElementById('decodeUrl');
        const copyUrlOutputBtn = document.getElementById('copyUrlOutput');

        encodeUrlBtn.addEventListener('click', () => {
            urlOutput.value = urlInput.value ? encodeURIComponent(urlInput.value) : '';
        });

        decodeUrlBtn.addEventListener('click', () => {
            if (urlInput.value) {
                try {
                    urlOutput.value = decodeURIComponent(urlInput.value);
                } catch (e) {
                    alert('解码失败，请检查输入的 URL 编码是否正确！');
                }
            } else {
                urlOutput.value = '';
            }
        });

        copyUrlOutputBtn.addEventListener('click', () => {
            if (urlOutput.value) {
                navigator.clipboard.writeText(urlOutput.value)
                    .then(() => alert('URL 结果已复制到剪贴板！'))
                    .catch(() => alert('复制失败，请手动复制。'));
            }
        });
    }
};
