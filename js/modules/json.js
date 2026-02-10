export const JsonModule = {
    render: () => `
        <div id="jsonFormatter" class="tool-content active">
            <h1>JSON 格式化</h1>
            <div class="input-area">
                <textarea id="jsonInput" placeholder="在此输入原始 JSON..."></textarea>
            </div>
            <div class="button-group">
                <button id="formatJson" class="secondary-btn">格式化</button>
                <button id="minifyJson" class="secondary-btn">压缩</button>
            </div>
            <div class="output-area">
                <textarea id="jsonOutput" readonly placeholder="输出结果"></textarea>
                <button id="copyJsonOutput" class="primary-btn">复制结果</button>
            </div>
        </div>
    `,
    init: () => {
        const jsonInput = document.getElementById('jsonInput');
        const jsonOutput = document.getElementById('jsonOutput');
        const formatJsonBtn = document.getElementById('formatJson');
        const minifyJsonBtn = document.getElementById('minifyJson');
        const copyJsonOutputBtn = document.getElementById('copyJsonOutput');

        formatJsonBtn.addEventListener('click', () => {
            try {
                const obj = JSON.parse(jsonInput.value);
                jsonOutput.value = JSON.stringify(obj, null, 4);
            } catch (e) {
                alert('JSON 格式不正确！');
            }
        });

        minifyJsonBtn.addEventListener('click', () => {
            try {
                const obj = JSON.parse(jsonInput.value);
                jsonOutput.value = JSON.stringify(obj);
            } catch (e) {
                alert('JSON 格式不正确！');
            }
        });

        copyJsonOutputBtn.addEventListener('click', () => {
            if (jsonOutput.value) {
                navigator.clipboard.writeText(jsonOutput.value)
                    .then(() => alert('JSON 结果已复制到剪贴板！'))
                    .catch(() => alert('复制失败，请手动复制。'));
            }
        });
    }
};
