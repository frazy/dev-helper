export const TimestampModule = {
    render: () => `
        <div id="timestampConverter" class="tool-content active">
            <h1>时间戳转换</h1>
            <div class="control-group-vertical">
                <label>时间戳 (秒/毫秒)</label>
                <div class="input-with-btn">
                    <input type="text" id="timestampInput" placeholder="例如: 1707552000">
                    <button id="convertTimestampToDate" class="secondary-btn">转换为日期</button>
                </div>
            </div>
            <div class="control-group-vertical">
                <label>日期时间 (YYYY-MM-DD HH:MM:SS)</label>
                <div class="input-with-btn">
                    <input type="datetime-local" id="dateInput">
                    <button id="convertDateToTimestamp" class="secondary-btn">转换为时间戳</button>
                </div>
            </div>
            <div class="output-area">
                <div class="result-display">
                    <input type="text" id="convertedResult" readonly placeholder="转换结果">
                    <button id="copyConvertedResult" class="copy-btn">复制</button>
                </div>
            </div>
        </div>
    `,
    init: () => {
        const timestampInput = document.getElementById('timestampInput');
        const dateInput = document.getElementById('dateInput');
        const convertedResult = document.getElementById('convertedResult');
        const convertToDateBtn = document.getElementById('convertTimestampToDate');
        const convertToTsBtn = document.getElementById('convertDateToTimestamp');
        const copyBtn = document.getElementById('copyConvertedResult');

        // 设置当前时间作为默认值
        const now = new Date();
        const localISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        dateInput.value = localISO;
        timestampInput.value = Math.floor(now.getTime() / 1000);

        convertToDateBtn.addEventListener('click', () => {
            try {
                let ts = parseInt(timestampInput.value);
                if (timestampInput.value.length === 13) ts = ts / 1000;
                const d = new Date(ts * 1000);
                convertedResult.value = d.toLocaleString();
            } catch (e) {
                alert('时间戳格式不正确');
            }
        });

        convertToTsBtn.addEventListener('click', () => {
            try {
                const ts = Math.floor(new Date(dateInput.value).getTime() / 1000);
                convertedResult.value = ts;
            } catch (e) {
                alert('日期格式不正确');
            }
        });

        copyBtn.addEventListener('click', () => {
            if (convertedResult.value) {
                navigator.clipboard.writeText(convertedResult.value)
                    .then(() => alert('结果已复制到剪贴板！'));
            }
        });
    }
};
