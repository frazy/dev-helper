import { copyToClipboard } from '../../script.js';

export const PasswordModule = {
    render: () => `
        <div id="passwordGenerator" class="tool-content active">
            <h1>密码生成器</h1>
            <div class="password-display" style="margin-bottom: 10px;">
                <input type="text" id="passwordOutput" readonly placeholder="点击生成按钮">
                <button id="copyPassword" class="copy-btn">复制</button>
            </div>
            
            <div id="passwordStrengthBar" style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; margin-bottom: 15px;">
                <div id="passwordStrengthFill" style="height: 100%; width: 0%; transition: all 0.3s ease;"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted); margin-bottom: 30px;">
                <span id="passwordStrengthText">强度: -</span>
                <div id="passwordHistory" style="display: flex; gap: 8px;">
                    <!-- 历史记录小标签 -->
                </div>
            </div>
            
            <div class="controls" style="background: rgba(0,0,0,0.2); padding: 30px; border-radius: 16px; border: 1px solid var(--card-border);">
                <div class="control-group" style="display: flex; align-items: center; margin-bottom: 25px;">
                    <label for="passwordLength" style="width: 120px; color: var(--text-muted);">密码长度:</label>
                    <input type="range" id="passwordLength" class="styled-range" min="8" max="128" value="20" style="flex: 1; margin: 0 20px;">
                    <span id="lengthValue" style="font-family: monospace; font-size: 18px; font-weight: bold; color: var(--primary-color); width: 40px; text-align: right;">20</span>
                </div>
                
                <div class="options-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div class="control-group toggle-group">
                        <label class="toggle-switch">
                            <input type="checkbox" id="includeUppercase" checked>
                            <span class="slider"></span>
                        </label>
                        <span class="toggle-label">包含大写字母 (A-Z)</span>
                    </div>
                    <div class="control-group toggle-group">
                        <label class="toggle-switch">
                            <input type="checkbox" id="includeLowercase" checked>
                            <span class="slider"></span>
                        </label>
                        <span class="toggle-label">包含小写字母 (a-z)</span>
                    </div>
                    <div class="control-group toggle-group">
                        <label class="toggle-switch">
                            <input type="checkbox" id="includeNumbers" checked>
                            <span class="slider"></span>
                        </label>
                        <span class="toggle-label">包含数字 (0-9)</span>
                    </div>
                    <div class="control-group toggle-group">
                        <label class="toggle-switch">
                            <input type="checkbox" id="includeSymbols">
                            <span class="slider"></span>
                        </label>
                        <span class="toggle-label">包含符号 (!@#$%)</span>
                    </div>
                    <div class="control-group toggle-group" style="grid-column: 1 / -1; margin-top: 10px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05);">
                        <label class="toggle-switch">
                            <input type="checkbox" id="excludeConfusing">
                            <span class="slider"></span>
                        </label>
                        <span class="toggle-label" style="color: #fbbf24;">排除易混淆字符 (1, l, 0, O)</span>
                    </div>
                </div>
                <button id="generatePassword" class="primary-btn" style="margin-top: 35px;">立即生成密码</button>
            </div>
        </div>
    `,
    init: () => {
        const passwordOutput = document.getElementById('passwordOutput');
        const copyPasswordBtn = document.getElementById('copyPassword');
        const passwordLength = document.getElementById('passwordLength');
        const lengthValue = document.getElementById('lengthValue');

        const includeUppercase = document.getElementById('includeUppercase');
        const includeLowercase = document.getElementById('includeLowercase');
        const includeNumbers = document.getElementById('includeNumbers');
        const includeSymbols = document.getElementById('includeSymbols');
        const excludeConfusing = document.getElementById('excludeConfusing');

        const generatePasswordBtn = document.getElementById('generatePassword');

        const strengthFill = document.getElementById('passwordStrengthFill');
        const strengthText = document.getElementById('passwordStrengthText');
        const passwordHistory = document.getElementById('passwordHistory');

        let history = [];

        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const numberChars = '0123456789';
        const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
        const confusingChars = /[il1Lo0O]/g;

        const evaluateStrength = (password) => {
            let score = 0;
            if (password.length > 8) score += 1;
            if (password.length > 12) score += 1;
            if (password.length >= 20) score += 1;
            if (/[A-Z]/.test(password)) score += 1;
            if (/[a-z]/.test(password)) score += 1;
            if (/[0-9]/.test(password)) score += 1;
            if (/[^A-Za-z0-9]/.test(password)) score += 1;

            let color = '#ef4444'; // Red
            let text = '弱 (Weak)';
            let width = '33%';

            if (score >= 6) {
                color = '#10b981'; // Green
                text = '极强 (Excellent)';
                width = '100%';
            } else if (score >= 4) {
                color = '#f59e0b'; // Yellow
                text = '中等 (Good)';
                width = '66%';
            }

            strengthFill.style.width = width;
            strengthFill.style.backgroundColor = color;
            strengthText.textContent = `强度: ${text}`;
            strengthText.style.color = color;
        };

        const updateHistoryUI = () => {
            passwordHistory.innerHTML = '<span style="opacity:0.5; margin-right:5px;">最近:</span>';
            history.forEach(pwd => {
                const badge = document.createElement('div');
                badge.className = 'history-badge';
                badge.textContent = pwd.substring(0, 5) + '...';
                badge.title = '点击复制此密码';
                badge.onclick = () => {
                    passwordOutput.value = pwd;
                    evaluateStrength(pwd);
                    copyToClipboard(pwd, '已复制历史密码');
                };
                passwordHistory.appendChild(badge);
            });
        };

        const generate = () => {
            let chars = '';
            if (includeUppercase.checked) chars += uppercaseChars;
            if (includeLowercase.checked) chars += lowercaseChars;
            if (includeNumbers.checked) chars += numberChars;
            if (includeSymbols.checked) chars += symbolChars;

            if (excludeConfusing.checked) {
                chars = chars.replace(confusingChars, '');
            }

            if (chars === '') {
                passwordOutput.value = '';
                strengthFill.style.width = '0%';
                strengthText.textContent = '强度: -';
                return;
            }

            let password = '';
            const length = parseInt(passwordLength.value);
            for (let i = 0; i < length; i++) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            passwordOutput.value = password;
            evaluateStrength(password);

            // Add to history
            if (password && !history.includes(password)) {
                history.unshift(password);
                if (history.length > 3) history.pop();
                updateHistoryUI();
            }
        };

        passwordLength.addEventListener('input', () => {
            lengthValue.textContent = passwordLength.value;
        });

        generatePasswordBtn.addEventListener('click', generate);
        copyPasswordBtn.addEventListener('click', () => copyToClipboard(passwordOutput.value));

        generate();
    }
};
