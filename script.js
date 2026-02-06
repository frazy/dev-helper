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

if (passwordLength) {
    lengthValue.textContent = passwordLength.value; // Initial display of length
    passwordLength.addEventListener('input', () => {
        lengthValue.textContent = passwordLength.value;
    });
}


if (generatePasswordBtn) generatePasswordBtn.addEventListener('click', generatePassword);
if (copyPasswordBtn) copyPasswordBtn.addEventListener('click', copyPasswordToClipboard); 

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

function copyPasswordToClipboard() { 
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

if (calculateMd5Btn) calculateMd5Btn.addEventListener('click', calculateMd5);
if (md5Input) md5Input.addEventListener('input', calculateMd5);
if (copyMd5Btn) copyMd5Btn.addEventListener('click', copyMd5ToClipboard);

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

// URL 编码/解码模块
const urlInput = document.getElementById('urlInput');
const urlOutput = document.getElementById('urlOutput');
const encodeUrlBtn = document.getElementById('encodeUrl');
const decodeUrlBtn = document.getElementById('decodeUrl');
const copyUrlOutputBtn = document.getElementById('copyUrlOutput');

if (encodeUrlBtn) encodeUrlBtn.addEventListener('click', encodeUrl);
if (decodeUrlBtn) decodeUrlBtn.addEventListener('click', decodeUrl);
if (copyUrlOutputBtn) copyUrlOutputBtn.addEventListener('click', copyUrlOutputToClipboard);

function encodeUrl() {
    if (urlInput.value) {
        urlOutput.value = encodeURIComponent(urlInput.value);
    } else {
        urlOutput.value = '';
    }
}

function decodeUrl() {
    if (urlInput.value) {
        try {
            urlOutput.value = decodeURIComponent(urlInput.value);
        } catch (e) {
            alert('解码失败，请检查输入的 URL 编码是否正确！');
            urlOutput.value = '解码错误: ' + e.message;
        }
    } else {
        urlOutput.value = '';
    }
}

function copyUrlOutputToClipboard() {
    if (urlOutput.value) {
        navigator.clipboard.writeText(urlOutput.value)
            .then(() => {
                alert('URL 结果已复制到剪贴板！');
            })
            .catch(err => {
                console.error('复制失败:', err);
                alert('复制失败，请手动复制。');
            });
    } else {
        alert('没有 URL 结果可供复制。');
    }
}

// JSON 格式化模块
const jsonInput = document.getElementById('jsonInput');
const jsonOutput = document.getElementById('jsonOutput');
const formatJsonBtn = document.getElementById('formatJson');
const minifyJsonBtn = document.getElementById('minifyJson');
const copyJsonOutputBtn = document.getElementById('copyJsonOutput');

if (formatJsonBtn) formatJsonBtn.addEventListener('click', formatJson);
if (minifyJsonBtn) minifyJsonBtn.addEventListener('click', minifyJson);
if (copyJsonOutputBtn) copyJsonOutputBtn.addEventListener('click', copyJsonOutputToClipboard);

function formatJson() {
    if (!jsonInput.value) {
        jsonOutput.value = '';
        return;
    }
    try {
        const obj = JSON.parse(jsonInput.value);
        jsonOutput.value = JSON.stringify(obj, null, 4); // 4 spaces indentation
    } catch (e) {
        alert('JSON 格式不正确！');
        jsonOutput.value = '格式化错误: ' + e.message;
    }
}

function minifyJson() {
    if (!jsonInput.value) {
        jsonOutput.value = '';
        return;
    }
    try {
        const obj = JSON.parse(jsonInput.value);
        jsonOutput.value = JSON.stringify(obj);
    } catch (e) {
        alert('JSON 格式不正确！');
        jsonOutput.value = '压缩错误: ' + e.message;
    }
}

function copyJsonOutputToClipboard() {
    if (jsonOutput.value) {
        navigator.clipboard.writeText(jsonOutput.value)
            .then(() => {
                alert('JSON 结果已复制到剪贴板！');
            })
            .catch(err => {
                console.error('复制失败:', err);
                alert('复制失败，请手动复制。');
            });
    } else {
        alert('没有 JSON 结果可供复制。');
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
        if (targetTab === 'md5Generator' && md5Input && md5Input.value) {
            calculateMd5();
        }
        // 激活密码生成器时生成密码
        if (targetTab === 'passwordGenerator' && passwordOutput) {
            generatePassword();
        }
        // 激活URL编码/解码工具时，如果输入框有内容，自动编码
        if (targetTab === 'urlEncoderDecoder' && urlInput && urlInput.value) {
             encodeUrl(); // 默认激活时执行编码
        }
        // 激活JSON格式化工具时，如果输入框有内容，自动格式化
        if (targetTab === 'jsonFormatter' && jsonInput && jsonInput.value) {
             formatJson(); // 默认激活时执行格式化
        }
    });
});

// Initial load: activate password generator and generate a password
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.tab-button[data-tab="passwordGenerator"]').click();
});
