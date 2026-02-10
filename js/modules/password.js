export const PasswordModule = {
    render: () => `
        <div id="passwordGenerator" class="tool-content active">
            <h1>密码生成器</h1>
            <div class="password-display">
                <input type="text" id="passwordOutput" readonly>
                <button id="copyPassword" class="copy-btn">复制</button>
            </div>
            <div class="controls">
                <div class="control-group">
                    <label for="passwordLength">密码长度:</label>
                    <input type="range" id="passwordLength" min="8" max="128" value="20">
                    <span id="lengthValue">20</span>
                </div>
                <div class="control-group">
                    <input type="checkbox" id="includeUppercase" checked>
                    <label for="includeUppercase">包含大写字母</label>
                </div>
                <div class="control-group">
                    <input type="checkbox" id="includeLowercase" checked>
                    <label for="includeLowercase">包含小写字母</label>
                </div>
                <div class="control-group">
                    <input type="checkbox" id="includeNumbers" checked>
                    <label for="includeNumbers">包含数字</label>
                </div>
                <div class="control-group">
                    <input type="checkbox" id="includeSymbols">
                    <label for="includeSymbols">包含符号</label>
                </div>
                <button id="generatePassword" class="primary-btn">生成密码</button>
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
        const generatePasswordBtn = document.getElementById('generatePassword');

        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const numberChars = '0123456789';
        const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

        const generate = () => {
            let characters = '';
            if (includeUppercase.checked) characters += uppercaseChars;
            if (includeLowercase.checked) characters += lowercaseChars;
            if (includeNumbers.checked) characters += numberChars;
            if (includeSymbols.checked) characters += symbolChars;

            if (characters === '') {
                alert('请至少选择一个字符类型！');
                passwordOutput.value = '';
                return;
            }

            let password = '';
            const length = parseInt(passwordLength.value);
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                password += characters[randomIndex];
            }
            passwordOutput.value = password;
        };

        const copy = () => {
            if (passwordOutput.value) {
                navigator.clipboard.writeText(passwordOutput.value)
                    .then(() => alert('密码已复制到剪贴板！'))
                    .catch(err => alert('复制失败，请手动复制。'));
            } else {
                alert('没有密码可供复制。');
            }
        };

        passwordLength.addEventListener('input', () => {
            lengthValue.textContent = passwordLength.value;
        });

        generatePasswordBtn.addEventListener('click', generate);
        copyPasswordBtn.addEventListener('click', copy);

        // 初始生成一次
        generate();
    }
};
