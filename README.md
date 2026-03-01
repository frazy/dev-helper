# 开发者助手 (Dev Helper)

Dev Helper 是一个基于原生 Web 技术（HTML, CSS, Vanilla JavaScript）构建的轻量级、响应式开发者工具集。该工具集拥有极简的玻璃拟物化 (Glassmorphism) UI 设计，致力于为开发者提供日常高频使用的便捷小工具。

## 🌟 功能模块

目前系统包含以下 5 个核心功能：

1. **密码生成 (Password Generator)**：生成随机高强度密码。
2. **MD5 生成 (MD5 Generator)**：文本字符串或数据的 MD5 加密摘要生成（基于 `crypto-js`）。
3. **URL 编解码 (URL Encoder/Decoder)**：对 URL 中的特殊字符进行快速编码与解码。
4. **JSON 格式化 (JSON Formatter)**：美化难以阅读的 JSON 字符串，支持格式验证。
5. **时间戳转换 (Timestamp Converter)**：Unix 时间戳与标准日期时间格式互转。

## 🚀 技术栈

- **前端核心**：HTML5, CSS3, ES6 Modules
- **UI 风格**：深色模式 (Dark Mode)，毛玻璃特效 (Glassmorphism)，全响应式布局
- **外部依赖**：`crypto-js` (用于 MD5 计算)
- **字体库**：
  - 界面字体：Inter
  - 代码/等宽字体：JetBrains Mono (或 Consolas)

## 📁 项目结构

```text
dev-helper/
├── index.html        # 主入口文件，包含基本结构和全局引用
├── style.css         # 全局样式表，包含 CSS 变量和响应式布局定义
├── script.js         # 主控逻辑脚手架，负责模块加载和路由控制
└── js/
    └── modules/      # 各业务功能独立模块
        ├── json.js
        ├── md5.js
        ├── password.js
        ├── timestamp.js
        └── url.js
```

## 🛠️ 如何运行

本项目没有复杂的构建步骤，主要依赖现代浏览器原生的 ES Module 支持：
1. 克隆本项目：`git clone https://github.com/frazy/dev-helper.git`
2. 使用任何本地 Web 服务器提供服务（由于使用了 `type="module"`，请避免直接以 `file://` 协议打开）。例如：
   - 使用 VS Code 的 "Live Server" 插件
   - Python: `python -m http.server`
   - Node.js: `npx serve`
3. 访问 `http://localhost:端口号` 即可使用。

## 📝 许可证

请参阅项目中的 [LICENSE](./LICENSE) 文件获取相关授权信息。
