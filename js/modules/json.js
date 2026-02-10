import { copyToClipboard, showToast } from '../../script.js';

export const JsonModule = {
    render: () => `
        <div id="jsonFormatter" class="tool-content active">
            <h1>JSON 格式化</h1>
            <div class="input-area">
                <textarea id="jsonInput" class="large-text-area" placeholder="在此输入原始 JSON..."></textarea>
            </div>
            <div class="button-group">
                <button id="formatJson" class="secondary-btn">格式化</button>
                <button id="minifyJson" class="secondary-btn">压缩</button>
                <button id="clearJson" class="secondary-btn" style="background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3);">清空内容</button>
            </div>
            <div class="output-area">
                <textarea id="jsonOutput" class="large-text-area" readonly placeholder="输出结果"></textarea>
                <button id="copyJsonOutput" class="primary-btn">复制格式化后的内容</button>
            </div>
        </div>
    `,
    init: () => {
        const jsonInput = document.getElementById('jsonInput');
        const jsonOutput = document.getElementById('jsonOutput');
        const formatJsonBtn = document.getElementById('formatJson');
        const minifyJsonBtn = document.getElementById('minifyJson');
        const copyJsonOutputBtn = document.getElementById('copyJsonOutput');
        const clearJsonBtn = document.getElementById('clearJson');

        formatJsonBtn.addEventListener('click', () => {
            if (!jsonInput.value) return;
            try {
                const obj = JSON.parse(jsonInput.value);
                jsonOutput.value = JSON.stringify(obj, null, 4);
                showToast('已完成 JSON 格式化');
            } catch (e) {
                showToast('JSON 格式不正确: ' + e.message, 'error');
            }
        });

        minifyJsonBtn.addEventListener('click', () => {
            if (!jsonInput.value) return;
            try {
                const obj = JSON.parse(jsonInput.value);
                jsonOutput.value = JSON.stringify(obj);
                showToast('已完成内容压缩');
            } catch (e) {
                showToast('JSON 格式不正确', 'error');
            }
        });

        clearJsonBtn.addEventListener('click', () => {
            jsonInput.value = '';
            jsonOutput.value = '';
            showToast('已清空');
        });

        copyJsonOutputBtn.addEventListener('click', () => copyToClipboard(jsonOutput.value));
    }
};
