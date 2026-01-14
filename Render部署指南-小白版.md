# 🚀 Render 部署指南（后端）- 小白版

## 📖 什么是 Render？

Render 是一个云平台，可以托管你的后端服务。就像把你的服务器放在云端，24 小时运行。

## 🎯 部署前准备

### 1. 准备工作

- ✅ 有一个 GitHub 账号（和 Vercel 用同一个）
- ✅ 代码已经推送到 GitHub（如果还没有，参考 Vercel 部署指南）

### 2. 准备环境变量

在部署前，你需要准备以下信息：

- **GEMINI_API_KEY**：你的 Google Gemini API Key
- **CORS_ORIGIN**：你的 Vercel 前端地址（比如：`https://hatgenerator.vercel.app`）

---

## 🚀 在 Render 部署后端

### 步骤 1：注册/登录 Render

1. 打开 https://render.com
2. 点击右上角的 **"Get Started for Free"**（免费开始）或 **"Sign In"**（登录）
3. 选择 **"Continue with GitHub"**（用 GitHub 登录）
4. 授权 Render 访问你的 GitHub

### 步骤 2：创建新服务

1. 登录后，点击右上角的 **"New +"**（新建）
2. 选择 **"Web Service"**（Web 服务）

### 步骤 3：连接 GitHub 仓库

1. 在 **"Connect a repository"**（连接仓库）页面
2. 找到你的 `hatgenerator` 仓库
3. 点击 **"Connect"**（连接）

**注意**：如果看不到仓库，点击 **"Configure account"**（配置账号）授权访问。

### 步骤 4：配置服务

#### 4.1 基本信息

- **Name**（名称）：`hatgenerator-backend`（可以自定义）
- **Region**（地区）：选择离你最近的（比如：`Singapore` 或 `Oregon`）
- **Branch**（分支）：`main`（或你的主分支名）
- **Root Directory**（根目录）：`server`（重要！）

#### 4.2 构建和启动命令

- **Build Command**（构建命令）：
  ```bash
  npm install && npm run build
  ```

- **Start Command**（启动命令）：
  ```bash
  npm start
  ```

#### 4.3 环境变量设置（非常重要！）

点击 **"Advanced"**（高级），然后点击 **"Add Environment Variable"**（添加环境变量），添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `GEMINI_API_KEY` | `你的API_Key` | Google Gemini API Key（必需） |
| `NODE_ENV` | `production` | 环境模式 |
| `PORT` | `10000` | 端口（Render 会自动分配，但可以设置） |
| `CORS_ORIGIN` | `https://你的vercel地址.vercel.app` | 前端地址（允许跨域） |

**重要提示**：
- `GEMINI_API_KEY` 必须填写，否则无法调用 API
- `CORS_ORIGIN` 必须填写你的 Vercel 前端地址，否则会有跨域错误
- 如果使用代理，可以添加 `HTTP_PROXY` 和 `HTTPS_PROXY`

#### 4.4 其他设置

- **Instance Type**（实例类型）：选择 **"Free"**（免费版）
- **Auto-Deploy**（自动部署）：保持 **"Yes"**（每次推送代码自动更新）

### 步骤 5：创建服务

1. 检查所有配置是否正确
2. 点击底部的 **"Create Web Service"**（创建 Web 服务）
3. 等待 5-10 分钟，Render 会自动：
   - 安装依赖
   - 构建项目
   - 启动服务

### 步骤 6：查看部署结果

部署完成后，你会看到：

- ✅ **Live**（运行中）状态
- 🌐 一个网址，比如：`https://hatgenerator-backend.onrender.com`

**重要**：记下这个地址，后面要在 Vercel 中配置！

---

## 🔧 部署后配置

### 1. 更新 Vercel 的前端配置

1. 打开 Vercel 项目页面
2. 点击 **"Settings"**（设置）
3. 点击 **"Environment Variables"**（环境变量）
4. 找到 `VITE_API_BASE_URL`
5. 更新为你的 Render 后端地址（比如：`https://hatgenerator-backend.onrender.com`）
6. 保存后，重新部署前端

### 2. 测试 API

在浏览器中访问：
```
https://你的render地址.onrender.com/api/health
```

如果看到 `{"status":"ok"}`，说明后端运行正常！

---

## 📝 常见问题

### Q1: 部署失败怎么办？

**检查清单：**
- ✅ Root Directory 是否设置为 `server`？
- ✅ Build Command 是否正确？
- ✅ Start Command 是否正确？
- ✅ 环境变量是否都配置了？

**查看错误：**
1. 在 Render 服务页面，点击 **"Logs"**（日志）
2. 查看错误信息
3. 根据错误提示修复

### Q2: 服务启动后立即停止？

**可能原因：**
- 端口配置错误
- 启动命令错误
- 代码有错误

**解决方法：**
1. 检查 **"Logs"**（日志）中的错误信息
2. 确认 `PORT` 环境变量（Render 会自动分配，可以不设置）
3. 确认 `npm start` 命令能正常运行

### Q3: API 调用失败？

**可能原因：**
- API Key 未配置或错误
- CORS 配置错误
- 网络问题

**解决方法：**
1. 检查 `GEMINI_API_KEY` 是否正确
2. 检查 `CORS_ORIGIN` 是否匹配前端地址
3. 查看 **"Logs"**（日志）中的详细错误

### Q4: 免费版会自动休眠？

**是的！** Render 免费版在 15 分钟无活动后会休眠。

**解决方法：**
1. **方案 1**：使用付费版（推荐生产环境）
2. **方案 2**：使用外部监控服务定期访问 API，保持活跃
3. **方案 3**：接受首次访问会慢一点（唤醒需要 30-60 秒）

### Q5: 如何更新服务？

**方法 1：自动更新（推荐）**
- 每次推送代码到 GitHub，Render 会自动重新部署

**方法 2：手动更新**
1. 在 Render 服务页面
2. 点击 **"Manual Deploy"**（手动部署）
3. 选择要部署的分支和提交

---

## 🔍 健康检查配置（可选）

为了让 Render 知道服务是否正常，可以配置健康检查：

1. 在服务设置中，找到 **"Health Check Path"**（健康检查路径）
2. 填写：`/api/health`
3. 保存

这样 Render 会自动检查服务状态。

---

## ✅ 部署完成检查清单

- [ ] Render 账号已注册/登录
- [ ] GitHub 仓库已连接
- [ ] Root Directory 设置为 `server`
- [ ] 构建和启动命令已配置
- [ ] 所有环境变量已配置
- [ ] 服务部署成功并运行
- [ ] 健康检查通过（访问 `/api/health`）
- [ ] Vercel 前端已更新 API 地址

---

## 🎉 完成！

现在你的后端已经部署到 Render 了！

**下一步**：测试完整的应用流程

1. 打开 Vercel 前端地址
2. 尝试生成内容
3. 检查是否正常工作

---

## 💡 小贴士

### 查看实时日志

在 Render 服务页面，点击 **"Logs"**（日志），可以实时查看服务运行情况，非常有用！

### 监控服务状态

Render 会在服务异常时发送邮件通知（如果配置了邮箱）。

### 升级到付费版

如果流量较大或需要更好的性能，可以考虑升级到付费版（最低 $7/月）。
