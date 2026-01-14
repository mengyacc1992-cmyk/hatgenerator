# ⚡ 快速开始 - 3 步体验功能

## 第 1 步：安装依赖

```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd server && npm install && cd ..
```

## 第 2 步：配置 API Key

```bash
# 创建环境变量文件
cp server/.env.example server/.env

# 编辑 server/.env，填入你的 Gemini API Key
# GEMINI_API_KEY=你的_api_key_在这里
```

**获取 API Key：** https://aistudio.google.com/

## 第 3 步：启动服务

**方式一：一键启动（推荐）**
```bash
./start.sh
```

**方式二：手动启动**
```bash
# 终端1：启动后端
cd server && npm run dev

# 终端2：启动前端
npm run dev
```

## 🎯 访问应用

打开浏览器：**http://localhost:3000**

---

详细说明请查看 [体验指南.md](体验指南.md)
