# 开发者助手 (Dev Helper)

Dev Helper 是一个基于 **Vue 3** 构建的轻量级、响应式开发者工具集。该工具集拥有极简的深色拟物化 UI 设计，致力于为开发者提供日常高频使用的便捷小工具。

## 🌟 功能模块

目前系统包含以下 5 个核心功能：

1. **密码生成 (Password Generator)**：生成随机高强度密码，支持密码强度可视化。
2. **Hash 加密 (Hash Generator)**：文本字符串的 MD5、SHA-1、SHA-256 加密摘要生成及目标 Hash 比对。
3. **URL 编解码 (URL Encoder/Decoder)**：对 URL 进行智能双向监听编码与解码功能，支持解构 Query 参数。
4. **JSON 格式化 (JSON Formatter)**：美化难以阅读的 JSON 字符串，支持一键粘贴解析及内容压缩。
5. **时间戳转换 (Timestamp Converter)**：提供实时时钟、Unix 时间戳与标准日期时间的精确互转及相对时间显示。

## 🚀 技术栈

- **前端框架**：Vue 3 (Composition API)
- **构建工具**：Vite 6
- **路由管理**：Vue Router 4
- **UI 风格**：深色模式 (Dark Mode)，纯 CSS 自定义组件（无第三方 UI 库依赖），弹性高度布局
- **外部依赖**：`crypto-js` (摘要算法), `highlight.js` (语法高亮), `@phosphor-icons/web` (图标)

## 📁 项目结构

```text
dev-helper/
├── index.html            # 主入口文件
├── vite.config.js        # Vite 构建配置文件
├── src/
│   ├── App.vue           # 根组件
│   ├── main.js           # Vue 挂载及应用入口
│   ├── router.js         # 路由配置
│   ├── style.css         # 全局及公共组件样式 (.panel-block, .btn-row 等)
│   ├── components/       # 通用组件
│   │   ├── AppSidebar.vue
│   │   └── CopyButton.vue
│   ├── composables/      # 可复用组合式函数 (Hooks)
│   │   ├── useClipboard.js
│   │   └── useToast.js
│   └── views/            # 各业务功能页面
│       ├── HashGenerator.vue
│       ├── JsonFormatter.vue
│       ├── PasswordGenerator.vue
│       ├── TimestampConverter.vue
│       └── UrlEncoder.vue
```

## 🛠️ 如何运行

本项目基于 Vite 构建，请确保本地已安装 [Node.js](https://nodejs.org/) (推荐版本 v18+)。

1. **克隆项目**
   ```bash
   git clone https://github.com/frazy/dev-helper.git
   cd dev-helper
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```
   随后在浏览器访问终端输出的本地地址 (通常为 `http://localhost:5173`) 即可使用。

4. **生产构建**
   ```bash
   npm run build
   ```
   构建产物将输出在 `dist` 目录中。

## 🌐 Nginx 部署配置

由于本项目使用 Vue Router 的 History 模式 (`createWebHistory`)，在直接访问深层路由（如 `/dev/password`）或刷新页面时，如果 Nginx 未做相应配置，会报 404 错误。

若您的应用部署在 Nginx 的子路径（例如 `/dev/`）下，请在配置中添加 `try_files` 兜底规则，将所有未找到的请求重定向到 `index.html`：

```nginx
server {
    # ... 其他配置

    location = /dev {
        alias /var/www/dev-helper/index.html;
        add_header Content-Type text/html;
    }

    location /dev/ {
        alias /var/www/dev-helper/;
        index index.html;
        
        # 关键配置：找不到文件时退回 index.html 给前端路由接管
        try_files $uri $uri/ /dev/index.html; 
        
        add_header Content-Type text/html;
    }
}
```

修改完成后，请记得重载 Nginx 配置以使其生效：
```bash
sudo nginx -s reload
```

## 📝 许可证

请参阅项目中的 [LICENSE](./LICENSE) 文件获取相关授权信息。
