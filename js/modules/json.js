import { copyToClipboard, showToast } from '../../script.js';

export const JsonModule = {
    render: () => `
        <div id="jsonFormatter" class="tool-content active">
            <h1>JSON 格式化</h1>
            
            <div class="dual-pane">
                <div class="input-pane">
                    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px;">
                        <label class="pane-label" style="margin-bottom: 0;">原始文本 / 编辑区</label>
                        <button id="pasteAndFormatJson" class="secondary-btn" style="padding: 6px 12px; font-size: 12px; background: rgba(99, 102, 241, 0.2); color: var(--primary-color);">一键粘贴并格式化 <i class="ph ph-clipboard"></i></button>
                    </div>
                    <textarea id="jsonInput" style="height: 55vh; min-height: 400px; font-size: 14px;" placeholder="在此输入原始 JSON..."></textarea>
                    
                    <div id="jsonErrorHint" style="display: none; margin-top: 10px; color: #ef4444; font-size: 13px; background: rgba(239, 68, 68, 0.1); padding: 10px; border-radius: 8px; border-left: 3px solid #ef4444;"></div>
                    
                    <div class="button-group" style="margin-top:20px; display:flex; gap:10px;">
                        <button id="formatJson" class="secondary-btn" style="flex:1">格式化 →</button>
                        <button id="minifyJson" class="secondary-btn" style="flex:1">压缩内容</button>
                    </div>
                </div>

                <div class="output-pane">
                    <label class="pane-label">处理结果 (只读 / 语法高亮)</label>
                    <div style="height: 55vh; min-height: 400px; background: #282c34; border-radius: 14px; border: 1px solid var(--card-border); overflow-y: auto; padding: 15px;">
                        <pre style="margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 14px;"><code id="jsonOutput" class="language-json" style="background: transparent; color: #abb2bf;">输出结果将在这里显示</code></pre>
                    </div>
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
        const jsonErrorHint = document.getElementById('jsonErrorHint');
        const formatJsonBtn = document.getElementById('formatJson');
        const minifyJsonBtn = document.getElementById('minifyJson');
        const pasteAndFormatJsonBtn = document.getElementById('pasteAndFormatJson');
        const copyJsonOutputBtn = document.getElementById('copyJsonOutput');
        const clearJsonBtn = document.getElementById('clearJson');

        let currentFormattedData = '';

        const renderHighlight = (jsonString) => {
            currentFormattedData = jsonString;
            jsonOutput.textContent = jsonString;
            // 确保 hljs 已加载
            if (window.hljs) {
                // hljs.highlightElement 会修改 DOM，故重新赋值 textContent
                jsonOutput.removeAttribute('data-highlighted');
                window.hljs.highlightElement(jsonOutput);
            }
        };

        const tryParseAndFormat = (action) => {
            jsonErrorHint.style.display = 'none';
            if (!jsonInput.value.trim()) {
                renderHighlight('// 等待输入...');
                return;
            }
            try {
                const obj = JSON.parse(jsonInput.value);
                if (action === 'format') {
                    renderHighlight(JSON.stringify(obj, null, 4));
                    showToast('已完成 JSON 格式化');
                } else if (action === 'minify') {
                    renderHighlight(JSON.stringify(obj));
                    showToast('已完成内容压缩');
                }
                jsonInput.style.borderColor = 'var(--card-border)';
            } catch (e) {
                jsonInput.style.borderColor = '#ef4444';
                let errMsg = e.message;
                // 尝试正则提取行号信息增加用户体验 (V8 Engine "at position")
                const positionMatch = errMsg.match(/at position (\d+)/);
                if (positionMatch) {
                    const pos = parseInt(positionMatch[1]);
                    const lines = jsonInput.value.substring(0, pos).split('\n');
                    const lineInfo = "发生在 第 " + lines.length + " 行，第 " + (lines[lines.length - 1].length + 1) + " 列";
                    errMsg = errMsg + "<br><strong>-> " + lineInfo + " 左右</strong>";
                }

                jsonErrorHint.innerHTML = '<i class="ph ph-warning"></i> 解析错误：' + errMsg;
                jsonErrorHint.style.display = 'block';
                renderHighlight('// 解析失败，请检查语法错误。\n// ' + e.message);
                showToast('JSON 格式有误', 'error');
            }
        };

        formatJsonBtn.addEventListener('click', () => tryParseAndFormat('format'));
        minifyJsonBtn.addEventListener('click', () => tryParseAndFormat('minify'));

        pasteAndFormatJsonBtn.addEventListener('click', async () => {
            try {
                const text = await navigator.clipboard.readText();
                if (text) {
                    jsonInput.value = text;
                    tryParseAndFormat('format');
                } else {
                    showToast('剪贴板为空', 'error');
                }
            } catch (err) {
                showToast('无法读取剪贴板，请检查浏览器权限', 'error');
            }
        });

        clearJsonBtn.addEventListener('click', () => {
            jsonInput.value = '';
            jsonInput.style.borderColor = 'var(--card-border)';
            jsonErrorHint.style.display = 'none';
            renderHighlight('输出结果将在这里显示');
            showToast('已清空');
        });

        copyJsonOutputBtn.addEventListener('click', () => copyToClipboard(currentFormattedData));

        // 初始化时清空
        renderHighlight('输出结果将在这里显示');
    }
};
