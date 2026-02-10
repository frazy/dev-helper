import { copyToClipboard, showToast } from '../../script.js';

export const UrlModule = {
    render: () => `
        <div id="urlEncoderDecoder" class="tool-content active">
            <h1>URL 编码/解码</h1>
            <div class="input-area" style="position:relative;">
                <label class="field-label" style="font-size:12px; color:var(--text-muted); margin-bottom:8px; display:block;">原始文本 / 解码结果</label>
                <textarea id="urlRaw" placeholder="在此输入普通文本..." style="min-height:160px;"></textarea>
                <div id="flagRaw" style="position:absolute; right:10px; top:35px; color:var(--success); font-weight:bold; opacity:0; transition:0.3s;">RECENTS</div>
            </div>
            
            <div class="interaction-bar" style="display:flex; gap:10px; margin: 24px 0;">
                <button id="btnEncode" class="secondary-btn" style="flex:1">向下编码 ↓</button>
                <button id="btnDecode" class="secondary-btn" style="flex:1">向上解码 ↑</button>
            </div>

            <div class="output-area" style="position:relative;">
                <label class="field-label" style="font-size:12px; color:var(--text-muted); margin-bottom:8px; display:block;">编码后的结果</label>
                <textarea id="urlResult" placeholder="这里显示处理后的内容..." style="min-height:160px;"></textarea>
                <div id="flagResult" style="position:absolute; right:15px; top:35px; color:var(--success); font-weight:bold; opacity:0; transition:0.3s;">RECENTS</div>
                <button id="copySmart" class="primary-btn" style="margin-top:15px;">智能复制结果</button>
            </div>
        </div>
    `,
    init: () => {
        const urlRaw = document.getElementById('urlRaw');
        const urlResult = document.getElementById('urlResult');
        const btnEncode = document.getElementById('btnEncode');
        const btnDecode = document.getElementById('btnDecode');
        const btnCopy = document.getElementById('copySmart');
        const flagRaw = document.getElementById('flagRaw');
        const flagResult = document.getElementById('flagResult');

        let lastAction = 'encode'; // 初始默认为编码出的结果

        const setLastAction = (action) => {
            lastAction = action;
            if (action === 'encode') {
                flagResult.style.opacity = '1';
                flagRaw.style.opacity = '0';
                btnCopy.textContent = '复制编码结果';
            } else {
                flagRaw.style.opacity = '1';
                flagResult.style.opacity = '0';
                btnCopy.textContent = '复制解码原文';
            }
        };

        btnEncode.addEventListener('click', () => {
            if (!urlRaw.value) return;
            try {
                urlResult.value = encodeURIComponent(urlRaw.value);
                setLastAction('encode');
                showToast('已编码');
            } catch (e) {
                showToast('编码失败', 'error');
            }
        });

        btnDecode.addEventListener('click', () => {
            const source = urlResult.value || urlRaw.value;
            if (!source) return;
            try {
                const decoded = decodeURIComponent(source);
                if (urlResult.value) {
                    urlRaw.value = decoded;
                } else {
                    urlResult.value = decoded; // 如果只有上边有内容，则解到下边
                }
                setLastAction('decode');
                showToast('已解码');
            } catch (e) {
                showToast('解码失败：格式不正确', 'error');
            }
        });

        btnCopy.addEventListener('click', () => {
            const text = lastAction === 'encode' ? urlResult.value : urlRaw.value;
            copyToClipboard(text, lastAction === 'encode' ? '已复制编码结果' : '已复制解密原文');
        });

        // 默认显示提示
        setLastAction('encode');
        flagResult.style.opacity = '0'; // 初始不显示 RECENT 标志
    }
};
