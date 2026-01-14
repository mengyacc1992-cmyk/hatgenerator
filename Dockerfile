# 多阶段构建 Dockerfile
# 前端 + 后端一体化部署

# 阶段1: 构建前端
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# 复制前端文件
COPY package.json package-lock.json* ./
COPY vite.config.ts tsconfig.json ./
COPY index.html ./
COPY index.tsx ./
COPY App.tsx ./
COPY types.ts ./
COPY constants.ts ./
COPY services/ ./services/

# 安装前端依赖
RUN npm ci

# 构建前端
RUN npm run build

# 阶段2: 构建后端
FROM node:20-alpine AS backend-builder

WORKDIR /app

# 复制后端文件
COPY server/package.json server/package-lock.json* ./server/
COPY server/tsconfig.json ./server/
COPY server/src/ ./server/src/

# 安装后端依赖
WORKDIR /app/server
RUN npm ci

# 构建后端
RUN npm run build

# 阶段3: 运行环境
FROM node:20-alpine

WORKDIR /app

# 安装生产依赖
COPY server/package.json server/package-lock.json* ./server/
WORKDIR /app/server
RUN npm ci --production

# 复制构建后的文件
COPY --from=backend-builder /app/server/dist ./dist
COPY --from=frontend-builder /app/dist ./public

# 复制环境变量文件（如果存在）
COPY server/.env* ./ 2>/dev/null || true

# 暴露端口
EXPOSE 3001

# 启动命令
CMD ["node", "dist/index.js"]
