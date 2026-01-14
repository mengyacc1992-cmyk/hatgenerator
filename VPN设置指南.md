# 🌐 VPN 设置指南

## 问题说明

错误信息："网络连接失败,无法访问 Gemini API"

**原因：** 无法连接到 Google 的服务器，需要 VPN。

## 解决方法

### 方法一：使用 VPN 软件（最简单）

#### 如果你已经有 VPN：

1. **打开 VPN 软件**
   - 启动你的 VPN 应用（如 ExpressVPN、NordVPN、Surfshark 等）

2. **连接到服务器**
   - 选择一个服务器节点
   - 等待连接成功

3. **验证连接**
   - 在浏览器访问：https://www.google.com
   - 如果能打开，说明 VPN 已连接

4. **重启后端服务**
   - 在后端终端窗口按 `Ctrl + C` 停止服务
   - 重新运行：
     ```bash
     cd /Users/chengchi/yadamengisgenius-1/hatgenerator/server
     npm run dev
     ```

5. **再次尝试生成**

#### 如果你没有 VPN：

**推荐 VPN 服务：**
- ExpressVPN
- NordVPN
- Surfshark
- Astrill
- 其他你信任的 VPN 服务

**选择建议：**
- 选择支持全局代理的 VPN
- 确保能访问 Google 服务
- 选择速度较快的服务器节点

### 方法二：配置系统代理

如果你有代理服务器地址：

1. **Mac 系统设置**
   - 系统设置 → 网络 → 代理
   - 配置 HTTP/HTTPS 代理
   - 输入代理服务器地址和端口

2. **重启后端服务**
   - 在后端终端窗口按 `Ctrl + C` 停止服务
   - 重新运行：
     ```bash
     cd /Users/chengchi/yadamengisgenius-1/hatgenerator/server
     npm run dev
     ```

### 方法三：使用终端代理（临时）

如果你有代理地址，可以在启动后端时设置：

```bash
# 设置代理环境变量
export HTTP_PROXY=http://代理地址:端口
export HTTPS_PROXY=http://代理地址:端口

# 启动后端
cd /Users/chengchi/yadamengisgenius-1/hatgenerator/server
npm run dev
```

## 验证 VPN 是否生效

### 测试 1：访问 Google
在浏览器访问：https://www.google.com
- ✅ 能打开 → VPN 正常
- ❌ 打不开 → VPN 未连接或无效

### 测试 2：访问 Gemini API
在浏览器访问：https://generativelanguage.googleapis.com
- ✅ 能打开 → 可以访问 Gemini API
- ❌ 打不开 → 仍需要 VPN

### 测试 3：在终端测试
```bash
curl https://generativelanguage.googleapis.com
```
- ✅ 有响应 → 网络正常
- ❌ 无响应 → 需要 VPN

## 常见问题

### Q: VPN 连接后还是不行？
A: 
1. 确认 VPN 已完全连接（不是正在连接）
2. 重启后端服务（重要！）
3. 尝试切换 VPN 服务器节点
4. 检查 VPN 是否支持全局代理

### Q: 没有 VPN 怎么办？
A: 
- 使用支持访问 Google 的网络环境
- 或者配置代理服务器
- 或者使用云服务器部署（有国际网络）

### Q: VPN 很慢怎么办？
A: 
- 选择速度较快的服务器节点
- 选择离你较近的服务器
- 或者尝试其他 VPN 服务

### Q: 可以不用 VPN 吗？
A: 
- 如果你不在中国大陆，可能不需要 VPN
- 如果在，通常需要 VPN 才能访问 Google 服务

## 重要提示

⚠️ **重启后端服务很重要！**

连接 VPN 后，**必须重启后端服务**，否则后端仍然使用旧的网络连接。

重启步骤：
1. 在后端终端窗口按 `Ctrl + C`
2. 重新运行 `npm run dev`
3. 看到 "Server is running" 后再尝试生成

## 需要帮助？

如果连接 VPN 后还是不行，请告诉我：
1. VPN 是否已连接成功？
2. 能否访问 https://www.google.com？
3. 后端终端显示什么错误信息？
