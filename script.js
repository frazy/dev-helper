// 密码生成器模块
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
copyPasswordBtn.addEventListener('click', copyPasswordToClipboard); // 更改函数名以避免冲突

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

function copyPasswordToClipboard() { // 更改函数名以避免冲突
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

// MD5 生成器模块
const md5Input = document.getElementById('md5Input');
const md5Output = document.getElementById('md5Output');
const calculateMd5Btn = document.getElementById('calculateMd5');
const copyMd5Btn = document.getElementById('copyMd5');

calculateMd5Btn.addEventListener('click', calculateMd5);
md5Input.addEventListener('input', calculateMd5); // 输入时自动计算
copyMd5Btn.addEventListener('click', copyMd5ToClipboard);

function calculateMd5() {
    const text = md5Input.value;
    if (text) {
        const hash = CryptoJS.MD5(text).toString();
        md5Output.value = hash;
    } else {
        md5Output.value = '';
    }
}

function copyMd5ToClipboard() {
    if (md5Output.value) {
        navigator.clipboard.writeText(md5Output.value)
            .then(() => {
                alert('MD5 值已复制到剪贴板！');
            })
            .catch(err => {
                console.error('复制失败:', err);
                alert('复制失败，请手动复制。');
            });
    } else {
        alert('没有 MD5 值可供复制。');
    }
}

// Tab 切换功能
const tabButtons = document.querySelectorAll('.tab-button');
const toolContents = document.querySelectorAll('.tool-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;

        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        toolContents.forEach(content => {
            if (content.id === targetTab) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        // 激活MD5工具时如果输入框有内容，自动计算
        if (targetTab === 'md5Generator' && md5Input.value) {
            calculateMd5();
        }
        // 激活密码生成器时生成密码
        if (targetTab === 'passwordGenerator') {
            generatePassword();
        }
    });
});

// Initial load: activate password generator and generate a password
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.tab-button[data-tab="passwordGenerator"]').click();
});
