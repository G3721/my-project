# GitHub Pages 部署指南

本指南详细说明如何将瑜伽经学习网站部署到GitHub Pages。

## 📋 部署前准备

### 1. 账户准备
- 拥有GitHub账户
- 安装Git工具

### 2. 仓库准备
- 将项目代码推送到GitHub仓库
- 仓库名称建议：`yoga-sutras`

## 🚀 自动部署（推荐）

### 方法1：直接使用GitHub Pages

1. **上传代码到GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Yoga Sutras Study Website"
   git branch -M main
   git remote add origin https://github.com/您的用户名/yoga-sutras.git
   git push -u origin main
   ```

2. **启用GitHub Pages**
   - 进入仓库的 Settings 页面
   - 在左侧菜单中找到 "Pages"
   - 在 "Source" 部分选择 "Deploy from a branch"
   - Branch 选择 "main"，文件夹 选择 "/ (root)"
   - 点击 "Save"

3. **等待部署**
   - GitHub会自动构建网站
   - 几分钟后，网站将在 `https://您的用户名.github.io/yoga-sutras/` 可访问

### 方法2：使用GitHub Actions（高级用户）

1. **创建GitHub Actions工作流**
   在 `.github/workflows/deploy.yml` 中创建：

   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]
     pull_request:
       branches: [ main ]

   jobs:
     deploy:
       runs-on: ubuntu-latest

       steps:
       - uses: actions/checkout@v3

       - name: Setup Node.js
         uses: actions/setup-node@v3
         with:
           node-version: '18'

       - name: Deploy to GitHub Pages
         uses: peaceiris/actions-gh-pages@v3
         if: github.ref == 'refs/heads/main'
         with:
           github_token: ${{ secrets.GITHUB_TOKEN }}
           publish_dir: ./
   ```

## 🔧 配置文件说明

### `_config.yml`
- Jekyll配置文件
- 告诉GitHub Pages如何处理网站
- 包含SEO和构建设置

### `.nojekyll`
- 告诉GitHub Pages这不是Jekyll项目
- 避免不必要的构建过程

### `site.webmanifest`
- PWA配置文件
- 支持离线使用和添加到主屏幕

### `sw.js`
- Service Worker文件
- 提供离线缓存功能

## 🌐 自定义域名（可选）

### 1. 添加CNAME文件
   在根目录创建 `CNAME` 文件：
   ```
   your-domain.com
   ```

### 2. 配置DNS
   在域名提供商处设置：
   - CNAME记录：`www` -> `您的用户名.github.io`
   - 或A记录指向GitHub Pages服务器

### 3. 在GitHub中设置
   - Settings -> Pages -> Custom domain
   - 输入您的域名

## 📱 PWA功能

网站已配置为渐进式Web应用，支持：

- **离线访问** - 通过Service Worker缓存
- **添加到主屏幕** - 在移动设备上
- **响应式设计** - 适配各种屏幕尺寸

## 🔍 SEO优化

网站包含完整的SEO优化：

- **结构化数据** - JSON-LD格式
- **Open Graph** - 社交媒体分享优化
- **Twitter Cards** - Twitter分享优化
- **元标签** - 完整的页面描述和关键词

## 📊 性能优化

### 懒加载
- 经文超过10条后自动懒加载
- 使用Intersection Observer API
- 提升首屏加载速度

### 缓存策略
- 静态资源：缓存优先
- 数据文件：网络优先，失败时使用缓存
- Service Worker管理缓存

### 字体优化
- Google Fonts预加载
- 字体显示策略优化
- FOUT/FOIT优化

## 🛠️ 故障排除

### 常见问题

**1. 网站无法访问**
   - 检查仓库是否为公开
   - 确认GitHub Pages已启用
   - 查看Actions页面构建状态

**2. 字体显示异常**
   - 检查网络连接
   - 清除浏览器缓存
   - 确认字体文件加载

**3. 离线功能不工作**
   - 检查Service Worker是否注册
   - 确认网站通过HTTPS访问
   - 查看浏览器开发者工具Console

**4. 样式显示异常**
   - 检查CSS文件路径
   - 确认文件编码为UTF-8
   - 验证CSS语法正确性

### 调试工具

1. **浏览器开发者工具**
   - Console查看错误信息
   - Network检查资源加载
   - Application查看Service Worker状态

2. **GitHub Pages日志**
   - Actions页面查看构建日志
   - Pages页面查看部署状态

## 📈 监控和分析

### Google Analytics（可选）
在HTML中添加Google Analytics代码：

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 性能监控
- 使用Lighthouse评估性能
- 监控Core Web Vitals指标
- 定期检查PageSpeed Insights

## 🔄 更新和维护

### 更新内容
1. 修改 `data/yoga-sutras.json`
2. 提交到GitHub
3. 自动部署新版本

### 更新样式
1. 修改 `css/style.css`
2. 更新版本号（可选）
3. 提交并推送

### 添加新功能
1. 修改HTML/JS/CSS文件
2. 测试功能正常
3. 提交并部署

## 📞 获取帮助

- **GitHub文档**: https://docs.github.com/en/pages
- **PWA文档**: https://web.dev/progressive-web-apps/
- **Service Worker**: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

---

**部署完成后，您的瑜伽经学习网站将对全球用户开放！** 🕉️