import { copyToClipboard, showToast } from '../../script.js';

export const JsonModule = {
    render: () => `
        <div id="jsonFormatter" class="tool-content active">
            <h1>JSON 格式化</h1>
            
            <div class="dual-pane">
                <div class="input-pane">
                    <label class="pane-label">原始文本 / 编辑区</label>
                    <textarea id="jsonInput" style="height: 55vh; min-height: 400px;" placeholder="在此输入原始 JSON..."></textarea>
                    <div class="button-group" style="margin-top:20px; display:flex; gap:10px;">
                        <button id="formatJson" class="secondary-btn" style="flex:1">格式化 →</button>
                        <button id="minifyJson" class="secondary-btn" style="flex:1">压缩内容</button>
                    </div>
                </div>

                <div class="output-pane">
                    <label class="pane-label">处理结果 (只读)</label>
                    <textarea id="jsonOutput" style="height: 55vh; min-height: 400px;" readonly placeholder="输出结果将在这里显示"></textarea>
                    <div class="button-group" style="margin-top:20px; display:flex; gap:10px;">
                        <button id="copyJsonOutput" class="primary-btn" style="flex:2; margin:0">复制结果</button>
                        <button id="clearJson" class="secondary-btn" style="flex:1; background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2);">清空</button>
                    </div>
                </div>
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
                showToast('JSON 格式有误: ' + e.message, 'error');
            }
        });

        minifyJsonBtn.addEventListener('click', () => {
            if (!jsonInput.value) return;
            try {
                const obj = JSON.parse(jsonInput.value);
                jsonOutput.value = JSON.stringify(obj);
                showToast('已完成内容压缩');
            } catch (e) {
                showToast('JSON 解析失败', 'error');
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
