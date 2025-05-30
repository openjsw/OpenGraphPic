
---

## ✅ `readme-zh.md`（中文版）

```markdown
# OpenGraphPic 图引图床部署说明（中文）

---

**OpenGraphPic** 是一个基于 [Telegraph（Telegram 文件服务）](https://core.telegram.org/bots/api#sending-files) 的开源图床工具，前端基于 Cloudflare Pages 实现，后端使用 Functions 和 D1 数据库构建，部署简单、零服务器。

---

## ✨ 功能特色

- 🖼️ 上传图片并生成直链  
- ☁️ 使用 Telegram Bot 托管文件  
- 🌍 Cloudflare Pages 零运维部署  
- 🔐 支持后台登录查看管理（用户名密码）  
- ✅ 支持白名单模式，只允许特定 IP 上传（WhiteList_Mode）

---

## 🧩 部署前准备

1. 拥有一个 Telegram Bot（通过 [@BotFather](https://t.me/BotFather) 创建）  
2. 创建一个频道并让 Bot 成为管理员  
3. 使用 [@GetTheirIDBot](https://t.me/GetTheirIDBot) 获取频道的 chat_id  
4. 创建 Cloudflare Pages 项目、D1 数据库  

---

## ⚙️ 环境变量配置

在 Cloudflare Pages 项目中添加以下环境变量：

| 变量名             | 描述                              |
|--------------------|-----------------------------------|
| `TG_Bot_Token`     | Telegram Bot Token                |
| `TG_Chat_ID`       | 频道 chat_id                      |
| `ADMIN_USERNAME`   | 管理后台用户名                    |
| `ADMIN_PASS`       | 管理后台密码                      |
| `WhiteList_Mode`   | 开启白名单模式（true/false）      |
| `WhiteList_IPs`    | 白名单 IP（英文逗号分隔）         |

> ✅ 开启 `WhiteList_Mode=true` 后，只有白名单图片才能展示。

---

## 🧱 D1 数据库表结构

在 Cloudflare D1 控制台执行以下 SQL：

```sql
CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  list_type TEXT DEFAULT 'None',
  rating_label TEXT DEFAULT 'None',
  liked INTEGER DEFAULT 0,
  timestamp INTEGER
);
## 📄 使用说明

* 上传页面入口：`https://yourdomain.net`
* 管理后台地址：`https://yourdomain.net/admin`（需要登录）

---

## ☁️ Cloudflare Pages 部署说明

1. Fork 本项目至你的 GitHub 账号

2. 在 Cloudflare Pages 中连接该仓库

3. 设置构建配置：

   * 构建命令：*(留空)*
   * 输出目录：`/`
   * 框架选择：None

4. 添加环境变量，绑定 D1 数据库为 `DB`

---

## 📜 开源协议

本项目基于 MIT License 开源。请勿用于非法用途，或违反 Telegram 使用条款。2025 OpenJSW™ / OpenGraphPic Project
