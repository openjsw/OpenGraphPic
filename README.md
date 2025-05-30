## 📘  JSWGraph图引 部署说明文档

---

### 📄 项目简介 

**JSWGraph** **图引**支持将你的图片转存到 [Telegraph] 

适合搭建私有图床服务，前端简洁美观，支持复制链接和预览。

---

### ⚙️ 原理说明 

1. 用户通过网页上传文件；
2. 前端将文件 POST 到后端（Cloudflare Functions）；
3. 后端使用 `TG_Bot_Token` 和 `TG_Chat_ID` 调用 Telegram Bot API 的 `sendDocument` 接口，将文件发送到 Telegram；
4. Telegram 会为每个文件返回一个 `file_id` 和可下载链接（通过 bot 文件 API）；
5. 后端返回该链接给前端展示。

> ✅ 上传后的文件托管在 Telegram , 但请勿滥用。

---

### 🧪 项目特点

* 🖼️ 支持图片上传；
* 🔗 自动生成可访问链接并复制；
* 🧱 可部署在 Cloudflare page上；
* 🌐 响应式网页，手机端也可良好使用。

---

### 🚀 部署指南 

#### ✅ 先决条件 

* 一个 Telegram Bot，并记下其 Token；，你可以获取 bot: [@BotFather](https://t.me/BotFather)
* 一个 Telegram Channel（可设为私有），将 Bot 添加为管理员；
* 获取该频道的 `TG_Bot_Token`（格式为 `-100xxxxxxxxxx`）；
* 你可以使用以下 bot 获取 TG_Chat_ID: [@getidsbot](https://t.me/GetTheirIDBot)

#### 🔐 环境变量

| 变量名  | 说明                   |
| -------------- | ----------------------------------- |
| `TG_Bot_Token` | 你的 Telegram Bot 的 Token（以 `bot` 开头） |
| `TG_Chat_ID`   | 目标频道的 chat_id，用于接收文件               |
| `ADMIN_PASS` | 后台管理密码 |
| `ADMIN_USERNAME`   | 后台管理用户名               |

---

#### ☁️ Cloudflare Pages 部署说明 

1.请先forker这个项目，然后在cloudflare page选择连接现有git库即可
2.创建D1数据库
```sql
CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,         
  name TEXT NOT NULL UNIQUE,                    
  list_type TEXT DEFAULT 'None',            
  rating_label TEXT DEFAULT 'None',         
  liked INTEGER DEFAULT 0,               
  timestamp INTEGER                        
);
```

3.绑定D1数据库

---



