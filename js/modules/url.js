import { copyToClipboard, showToast } from '../../script.js';

export const UrlModule = {
    render: () => `
        <div id="urlEncoderDecoder" class="tool-content active">
            <h1>URL 编码/解码</h1>
            <div class="input-area">
                <label class="field-label">原始文本</label>
                <textarea id="urlRaw" placeholder="例如: Hello World!"></textarea>
            </div>
            
            <div class="interaction-bar" style="display:flex; gap:10px; margin-bottom: 24px;">
                <button id="btnEncode" class="secondary-btn" style="flex:1">向下编码 ↓</button>
                <button id="btnDecode" class="secondary-btn" style="flex:1">向上解码 ↑</button>
            </div>

            <div class="output-area">
                <label class="field-label">处理结果 (URL Safe 编码)</label>
                <textarea id="urlResult" placeholder="这里显示编码/解码后的结果"></textarea>
                <button id="copyUrlResult" class="primary-btn">复制结果内容</button>
            </div>
        </div>
    `,
    init: () => {
        const urlRaw = document.getElementById('urlRaw');
        const urlResult = document.getElementById('urlResult');
        const btnEncode = document.getElementById('btnEncode');
        const btnDecode = document.getElementById('btnDecode');
        const btnCopy = document.getElementById('copyUrlResult');

        btnEncode.addEventListener('click', () => {
            if (!urlRaw.value) return;
            urlResult.value = encodeURIComponent(urlRaw.value);
            showToast('已完成 URL 编码');
        });

        btnDecode.addEventListener('click', () => {
            if (!urlResult.value) {
                // 如果结果框没内容，尝试解码原始框内容到结果框（为了方便）
                if (urlRaw.value) {
                    try {
                        urlResult.value = decodeURIComponent(urlRaw.value);
                        showToast('已完成 URL 解码');
                    } catch (e) {
                        showToast('解码失败：格式不正确', 'error');
                    }
                }
                return;
            }
            // 正常的反向逻辑：将结果框内容解码回原始框
            try {
                urlRaw.value = decodeURIComponent(urlResult.value);
                showToast('已完成反向解码到上方容器');
            } catch (e) {
                showToast('解码失败：内容格式有误', 'error');
            }
        });

        btnCopy.addEventListener('click', () => copyToClipboard(urlResult.value));
    }
};
