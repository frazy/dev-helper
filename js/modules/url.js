import { copyToClipboard, showToast } from '../../script.js';

export const UrlModule = {
    render: () => `
        <div id="urlEncoderDecoder" class="tool-content active">
            <h1>URL 编解码</h1>
            <div class="input-area" style="position:relative;">
                <label class="field-label" style="font-size:12px; color:var(--text-muted); margin-bottom:8px; display:block;">原始文本 / 解码结果</label>
                <textarea id="urlRaw" placeholder="在此输入普通文本或URL..." style="min-height:160px;"></textarea>
                <div id="flagRaw" class="status-badge" style="position:absolute; right:15px; top:40px; background: rgba(16, 185, 129, 0.2); color: var(--success); padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: bold; opacity:0; transition:0.3s; pointer-events: none;">[由解码生成]</div>
            </div>
            
            <div class="interaction-bar" style="display:flex; justify-content: space-between; align-items: center; margin: 20px 0;">
                <div style="font-size: 13px; color: var(--text-muted); display: flex; align-items: center; gap: 8px;">
                    <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--primary-color); box-shadow: 0 0 8px var(--primary-color);"></div>
                    已启用智能双向监听检测
                </div>
                <div style="display:flex; gap:10px;">
                    <button id="btnEncode" class="secondary-btn" style="padding: 10px 20px;">向下编码 ↓</button>
                    <button id="btnDecode" class="secondary-btn" style="padding: 10px 20px;">向上解码 ↑</button>
                </div>
            </div>

            <div class="output-area" style="position:relative;">
                <label class="field-label" style="font-size:12px; color:var(--text-muted); margin-bottom:8px; display:block;">编码后的结果</label>
                <textarea id="urlResult" placeholder="这里显示处理后的内容..." style="min-height:160px;"></textarea>
                <div id="flagResult" class="status-badge" style="position:absolute; right:15px; top:40px; background: rgba(16, 185, 129, 0.2); color: var(--success); padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: bold; opacity:0; transition:0.3s; pointer-events: none;">[由编码生成]</div>
                
                <div id="paramsContainer" style="display: none; margin-top: 15px; background: rgba(0,0,0,0.2); border-radius: 12px; border: 1px solid var(--card-border); overflow: hidden;">
                    <div style="padding: 12px 16px; background: rgba(255,255,255,0.05); font-size: 13px; color: var(--text-muted); border-bottom: 1px solid var(--card-border);">📋 Query 参数解析</div>
                    <div style="padding: 16px; overflow-x: auto;">
                        <table id="paramsTable" style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
                            <!-- 参数表内容 -->
                        </table>
                    </div>
                </div>

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

        const paramsContainer = document.getElementById('paramsContainer');
        const paramsTable = document.getElementById('paramsTable');

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

        const renderParamsTable = (urlStr) => {
            try {
                // 处理仅仅是参数字符串的情况
                let queryStr = urlStr;
                if (urlStr.includes('?')) {
                    queryStr = urlStr.split('?')[1];
                }

                if (!queryStr || !queryStr.includes('=')) {
                    paramsContainer.style.display = 'none';
                    return;
                }

                const params = new URLSearchParams(queryStr);
                const entries = Array.from(params.entries());

                if (entries.length === 0) {
                    paramsContainer.style.display = 'none';
                    return;
                }

                let html = '<tr><th style="padding:8px; border-bottom:1px solid rgba(255,255,255,0.1); width: 30%;">Key</th><th style="padding:8px; border-bottom:1px solid rgba(255,255,255,0.1);">Value</th></tr>';
                entries.forEach(([key, value]) => {
                    html += `<tr>
                        <td style="padding:8px; border-bottom:1px solid rgba(255,255,255,0.05); color: var(--primary-color); font-family: monospace;">${key}</td>
                        <td style="padding:8px; border-bottom:1px solid rgba(255,255,255,0.05); font-family: monospace; word-break: break-all;">${value}</td>
                    </tr>`;
                });

                paramsTable.innerHTML = html;
                paramsContainer.style.display = 'block';
            } catch (e) {
                paramsContainer.style.display = 'none';
            }
        };

        const doEncode = (silent = false) => {
            if (!urlRaw.value) {
                if (!silent) showToast('内容为空', 'error');
                return;
            }
            try {
                urlResult.value = encodeURIComponent(urlRaw.value);
                setLastAction('encode');
                if (!silent) showToast('已强制编码');
                renderParamsTable(urlRaw.value);
            } catch (e) {
                if (!silent) showToast('编码失败', 'error');
            }
        };

        const doDecode = (silent = false) => {
            const source = urlResult.value || urlRaw.value;
            if (!source) {
                if (!silent) showToast('内容为空', 'error');
                return;
            }
            try {
                const decoded = decodeURIComponent(source);
                urlRaw.value = decoded;
                setLastAction('decode');
                if (!silent) showToast('已强制解码');
                renderParamsTable(decoded);
            } catch (e) {
                if (!silent) showToast('解码失败：格式不正确', 'error');
            }
        };

        // 按钮事件
        btnEncode.addEventListener('click', () => doEncode(false));
        btnDecode.addEventListener('click', () => doDecode(false));

        // 智能侦听事件
        let encodeTimeout;
        urlRaw.addEventListener('input', () => {
            clearTimeout(encodeTimeout);
            encodeTimeout = setTimeout(() => {
                const val = urlRaw.value.trim();
                // 如果包含未编码的中文字符或明显需要编码的符号，则自动尝试编码
                if (val && /[^\x00-\x7F]/g.test(val)) {
                    doEncode(true);
                } else if (val) {
                    renderParamsTable(val);
                } else {
                    paramsContainer.style.display = 'none';
                    urlResult.value = '';
                    flagResult.style.opacity = '0';
                    flagRaw.style.opacity = '0';
                }
            }, 300);
        });

        let decodeTimeout;
        urlResult.addEventListener('input', () => {
            clearTimeout(decodeTimeout);
            decodeTimeout = setTimeout(() => {
                const val = urlResult.value.trim();
                // 如果存在被明显编码的 %xx 字符，则自动尝试解码
                if (val && /%[0-9A-Fa-f]{2}/.test(val)) {
                    doDecode(true);
                } else if (val) {
                    renderParamsTable(val);
                } else {
                    paramsContainer.style.display = 'none';
                    urlRaw.value = '';
                    flagResult.style.opacity = '0';
                    flagRaw.style.opacity = '0';
                }
            }, 300);
        });

        btnCopy.addEventListener('click', () => {
            const text = lastAction === 'encode' ? urlResult.value : urlRaw.value;
            copyToClipboard(text, lastAction === 'encode' ? '已复制编码结果' : '已复制解码原文');
        });

        // 默认隐藏
        setLastAction('encode');
        flagResult.style.opacity = '0';
    }
};
