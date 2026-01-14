# 🌐 Vercel 部署指南（前端）- 小白版

## 📖 什么是 Vercel？

Vercel 是一个免费的网站托管平台，可以自动部署你的前端网站。就像把你的网站放在网上，让全世界都能访问。

## 🎯 部署前准备

### 1. 准备工作

- ✅ 有一个 GitHub 账号（如果没有，去 https://github.com 注册）
- ✅ 你的代码已经推送到 GitHub（如果还没有，看下面的步骤）

### 2. 把代码上传到 GitHub

#### 步骤 1：在 GitHub 创建新仓库

1. 打开 https://github.com
2. 点击右上角的 **"+"** 号，选择 **"New repository"**（新建仓库）
3. 填写仓库名称，比如：`hatgenerator`
4. 选择 **Public**（公开）或 **Private**（私有）
5. 不要勾选 "Initialize this repository with a README"（不要初始化 README）
6. 点击 **"Create repository"**（创建仓库）

#### 步骤 2：上传代码到 GitHub

在终端（Terminal）运行以下命令：

```bash
# 1. 进入项目目录（如果还没进入）
cd /Users/chengchi/yadamengisgenius-1/hatgenerator

# 2. 初始化 Git（如果还没有）
git init

# 3. 添加所有文件
git add .

# 4. 提交代码
git commit -m "Initial commit"

# 5. 添加 GitHub 仓库地址（替换成你的仓库地址）
git remote add origin https://github.com/你的用户名/hatgenerator.git

# 6. 推送代码
git push -u origin main
```

**注意**：如果提示需要登录，按照提示操作即可。

---

## 🚀 在 Vercel 部署前端

### 步骤 1：注册/登录 Vercel

1. 打开 https://vercel.com
2. 点击右上角的 **"Sign Up"**（注册）或 **"Log In"**（登录）
3. 选择 **"Continue with GitHub"**（用 GitHub 登录）
4. 授权 Vercel 访问你的 GitHub

### 步骤 2：创建新项目

1. 登录后，点击 **"Add New..."**（添加新项目）
2. 点击 **"Project"**（项目）
3. 在项目列表中，找到你的 `hatgenerator` 仓库
4. 点击 **"Import"**（导入）

### 步骤 3：配置项目

#### 3.1 基本设置

- **Framework Preset**（框架预设）：选择 **"Vite"**（会自动检测）
- **Root Directory**（根目录）：保持默认（`.`）
- **Build Command**（构建命令）：`npm run build`
- **Output Directory**（输出目录）：`dist`
- **Install Command**（安装命令）：`npm install`

#### 3.2 环境变量设置（重要！）

点击 **"Environment Variables"**（环境变量），添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `VITE_API_BASE_URL` | `https://你的render服务地址.onrender.com` | 后端 API 地址 |

**注意**：
- 这个地址要等 Render 部署完成后才能知道
- 可以先填一个临时值，后面再修改

#### 3.3 部署设置

- **Production**（生产环境）：选择 `main` 分支
- 其他保持默认

### 步骤 4：开始部署

1. 点击 **"Deploy"**（部署）按钮
2. 等待 2-3 分钟，Vercel 会自动：
   - 安装依赖
   - 构建项目
   - 部署网站

### 步骤 5：查看部署结果

部署完成后，你会看到：

- ✅ **Success**（成功）提示
- 🌐 一个网址，比如：`https://hatgenerator.vercel.app`

点击这个网址，就能看到你的网站了！

---

## 🔧 部署后配置

### 更新后端 API 地址

1. 在 Vercel 项目页面，点击 **"Settings"**（设置）
2. 点击 **"Environment Variables"**（环境变量）
3. 找到 `VITE_API_BASE_URL`
4. 点击编辑，更新为你的 Render 后端地址
5. 点击 **"Save"**（保存）
6. 点击 **"Deployments"**（部署），找到最新的部署
7. 点击右上角的 **"..."**，选择 **"Redeploy"**（重新部署）

---

## 📝 常见问题

### Q1: 部署失败怎么办？

**检查清单：**
- ✅ 代码是否已推送到 GitHub？
- ✅ 环境变量是否配置正确？
- ✅ 构建命令是否正确？

**查看错误：**
1. 在 Vercel 项目页面，点击失败的部署
2. 查看 **"Build Logs"**（构建日志）
3. 找到错误信息，根据错误提示修复

### Q2: 网站打开是空白？

**可能原因：**
- API 地址配置错误
- 后端服务未启动

**解决方法：**
1. 检查浏览器控制台（F12）的错误信息
2. 确认 `VITE_API_BASE_URL` 是否正确
3. 确认后端服务是否正常运行

### Q3: 如何更新网站？

**方法 1：自动更新（推荐）**
- 每次推送代码到 GitHub，Vercel 会自动重新部署

**方法 2：手动更新**
1. 在 Vercel 项目页面
2. 点击 **"Deployments"**（部署）
3. 找到要更新的部署
4. 点击 **"..."**，选择 **"Redeploy"**（重新部署）

---

## ✅ 部署完成检查清单

- [ ] 代码已推送到 GitHub
- [ ] Vercel 项目已创建
- [ ] 环境变量已配置
- [ ] 部署成功
- [ ] 网站可以正常访问
- [ ] API 地址已更新为 Render 后端地址

---

## 🎉 完成！

现在你的前端已经部署到 Vercel 了！

**下一步**：部署后端到 Render（查看 `Render部署指南-小白版.md`）
