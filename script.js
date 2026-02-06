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

lengthValue.textContent = passwordLength.value; // Initial display of length

passwordLength.addEventListener('input', () => {
    lengthValue.textContent = passwordLength.value;
});

generatePasswordBtn.addEventListener('click', generatePassword);
copyPasswordBtn.addEventListener('click', copyToClipboard);

function generatePassword() {
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
    const length = passwordLength.value;
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }
    passwordOutput.value = password;
}

function copyToClipboard() {
    if (passwordOutput.value) {
        navigator.clipboard.writeText(passwordOutput.value)
            .then(() => {
                alert('密码已复制到剪贴板！');
            })
            .catch(err => {
                console.error('复制失败:', err);
                alert('复制失败，请手动复制。');
            });
    } else {
        alert('没有密码可供复制。');
    }
}

// Generate a password on initial load
generatePassword();