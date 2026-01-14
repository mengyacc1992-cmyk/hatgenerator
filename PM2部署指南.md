# 📦 PM2 部署指南

## 什么是 PM2？

PM2 是一个 Node.js 进程管理器，可以：
- 保持应用持续运行
- 自动重启崩溃的应用
- 监控应用状态
- 管理日志

## 安装 PM2

```bash
npm install -g pm2
```

## 部署后端

### 1. 构建后端

```bash
cd server
npm install
npm run build
```

### 2. 启动服务

```bash
# 使用配置文件启动
pm2 start ecosystem.config.js

# 或直接启动
pm2 start dist/index.js --name hatgenerator-backend --env production
```

### 3. 查看状态

```bash
pm2 status
pm2 logs hatgenerator-backend
```

### 4. 常用命令

```bash
# 停止服务
pm2 stop hatgenerator-backend

# 重启服务
pm2 restart hatgenerator-backend

# 删除服务
pm2 delete hatgenerator-backend

# 查看详细信息
pm2 info hatgenerator-backend

# 监控
pm2 monit
```

### 5. 开机自启

```bash
# 保存当前 PM2 进程列表
pm2 save

# 生成开机启动脚本
pm2 startup

# 按照提示执行生成的命令
```

## 部署前端

### 方式一：使用 PM2 Serve

```bash
# 构建前端
npm run build

# 使用 PM2 启动静态服务器
pm2 serve dist 3000 --name hatgenerator-frontend --spa
```

### 方式二：使用 Nginx（推荐）

配置 Nginx 指向 `dist` 目录，参考 `nginx.conf`。

## 监控和日志

### 查看日志

```bash
# 实时日志
pm2 logs hatgenerator-backend

# 最近 100 行
pm2 logs hatgenerator-backend --lines 100

# 错误日志
pm2 logs hatgenerator-backend --err
```

### 监控面板

```bash
pm2 monit
```

### Web 监控（可选）

```bash
pm2 install pm2-web
# 访问 http://localhost:9615
```

## 性能优化

### 集群模式（如果需要）

修改 `ecosystem.config.js`：
```javascript
instances: 'max',  // 使用所有 CPU 核心
exec_mode: 'cluster'
```

### 内存限制

```javascript
max_memory_restart: '500M'  // 内存超过 500M 自动重启
```

## 故障排查

### 服务无法启动
```bash
# 查看详细错误
pm2 logs hatgenerator-backend --err --lines 50
```

### 服务频繁重启
```bash
# 查看重启原因
pm2 info hatgenerator-backend
```

### 清理日志
```bash
pm2 flush
```
