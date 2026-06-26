# 文生图工具

这是一个本地运行的文生图前端 + Node.js 代理服务。

## 功能

- 提供一个网页界面，输入 Prompt 后生成图片
- 支持两种模式
  - 文生图
  - 图生图
- 本地服务负责接收前端请求，再转发到 Agnes AI 的图片生成接口
- 默认通过 `http://localhost:8765` 提供服务

## 技术栈

- Node.js 原生 `http` 模块
- 原生 HTML / JavaScript
- Tailwind CSS CDN
- PM2 进程管理

## 项目结构

- `app/server.js`：本地代理服务入口
- `app/index.html`：前端页面
- `app/ecosystem.config.cjs`：PM2 启动配置
- `app/.env`：本地环境变量文件，不提交到仓库

## 部署与运行

下面是一套适合“全新 Windows 电脑”的部署方式。

### 1. 安装 Node.js

先安装 Node.js LTS 版本。

安装完成后，打开新的终端，确认下面两个命令可用：

```bash
node -v
npm -v
```

### 2. 安装 PM2

全局安装 PM2：

```bash
npm i -g pm2
```

如果安装后 `pm2` 仍然提示找不到命令，重新打开终端再试一次。

### 3. 准备项目

把项目放到本地，例如：

```bash
cd D:\Project\Free_txt2img\app
```

### 4. 配置接口密钥

在 `app` 目录下创建 `.env` 文件，内容如下：

```env
AGNES_API_KEY=你的真实密钥
```

这个文件已经在 `.gitignore` 里，不会被提交。

### 5. 启动服务

执行：

```bash
npm run pm2:start
```

这个命令会：

- 使用 `app/ecosystem.config.cjs` 启动服务
- 将 PM2 的运行状态存到项目目录下的 `.pm2/`
- 以生产方式托管 `server.js`

### 6. 检查状态

查看进程状态：

```bash
npm run pm2:list
```

查看运行日志：

```bash
npm run pm2:logs
```

也可以直接打开浏览器访问：

```text
http://localhost:8765
```

## 停止与重启

- 停止服务：`npm run pm2:stop`
- 重启服务：`npm run pm2:restart`
- 查看日志：`npm run pm2:logs`

## 说明

- 本项目运行时会产生 PM2 的状态文件和日志文件，它们位于 `.pm2/`
- `.pm2/` 已加入 `.gitignore`
- `run.bat` 不再需要，也不作为提交内容保留

## 备注

- 如果你想修改端口，可以改 `app/ecosystem.config.cjs` 里的 `PORT`
- 如果上游接口地址变化，可以改 `app/server.js` 里的 `API_URL`
