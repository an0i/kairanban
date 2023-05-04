# 传阅板
### 一个简单的在线剪切板，方便在不同设备之间临时传输文本

## 演示
[kai-web.vercel.app](https://kai-web.vercel.app)

## 特点
无服务器

## 注意
除 https 外明文传输和储存，请勿传输重要文本

## 部署
### 后端
1. 创建 [Upstash](https://upstash.com) Redis 数据库
2. 获取`UPSTASH_REDIS_REST_URL`和`UPSTASH_REDIS_REST_TOKEN`
3. Fork 该仓库
4. 使用 vercel 添加环境变量`UPSTASH_REDIS_REST_URL`和`UPSTASH_REDIS_REST_TOKEN`并部署
### 前端
[kai-web](https://github.com/an0i/kai-web)

## 接口
[API](API.md)
