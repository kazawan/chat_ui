# Chat UI 项目部署文档

## 项目介绍
这是一个基于Node.js和React的聊天应用，使用Docker进行容器化部署。

## 环境要求
- Docker (20.10.0+)
- Docker Compose (v2.0.0+)

## 部署步骤

### 1. 克隆项目
```bash
git clone <project-url>
cd <project-directory>
```

### 2. 环境变量配置
1. 进入docker目录：
```bash
cd docker
```

2. 复制环境变量示例文件：
```bash
cp .env.example .env
```

3. 修改.env文件中的配置：
```ini
VITE_BASE_URL=http://your-domain:5050   # 修改为你的域名或IP
PORT=5050                                # 应用运行端口
JWT_SECRET=your_jwt_secret              # JWT密钥，请修改为强密码
DEEPSEEK_API_KEY=your_deepseek_api_key  # Deepseek API密钥
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1  # Deepseek API地址
```

### 3. 启动服务
在docker目录下运行：
```bash
docker-compose up -d
```

首次启动会进行以下操作：
- 构建前端应用
- 构建后端服务
- 创建数据卷
- 启动服务

### 4. 验证部署
访问 `http://your-domain:5050` 验证服务是否正常运行。

## 数据持久化
- SQLite数据库文件存储在Docker卷 `sqlite_data` 中
- 数据目录映射到容器的 `/app/data` 目录

## 维护命令

### 查看日志
```bash
docker-compose logs -f
```

### 重启服务
```bash
docker-compose restart
```

### 停止服务
```bash
docker-compose down
```

### 重新构建（代码更新后）
```bash
docker-compose up -d --build
```

## 注意事项
1. 首次部署时请确保修改环境变量中的敏感信息
2. 确保服务器防火墙开放了对应端口
3. 建议在生产环境中使用HTTPS
4. 定期备份数据卷中的数据

## 故障排查
如果遇到问题，请检查：
1. Docker容器状态：`docker-compose ps`
2. 容器日志：`docker-compose logs -f`
3. 确认环境变量配置正确
4. 确认端口未被占用