# OpenGraphPic

> A lightweight, serverless image hosting tool powered by Telegraph and Cloudflare Pages.

[🇨🇳 中文说明文档](./README-ZH.md)

---

## 📌 Overview

**OpenGraphPic** allows you to upload and host images via [Telegraph], a content delivery service used by Telegram bots.  
It provides a simple, responsive frontend and a backend built on **Cloudflare Pages + Functions + D1**, making it fast, serverless, and easy to deploy.

---

## ✨ Features

- 📤 Upload images and get public CDN links instantly  
- 🌐 Fully responsive UI for desktop and mobile  
- 🧩 Serverless backend using Cloudflare Functions  
- 📄 Telegram-based storage (via Bot API)  
- 🔐 Admin panel with basic authentication  
- ✅ whitelist mode (`WhiteList_Mode=true`)  

---

## ⚙️ How It Works

1. Frontend uploads the image via HTTP POST to the backend  
2. The backend sends the file to Telegram via `sendDocument`  
3. It retrieves the file link using the Bot API  
4. The link is returned and displayed for the user  

> Note: All files are stored on Telegram's CDN. Please avoid abuse.

---

## 🚀 Deployment Guide (Cloudflare Pages)

### 🔧 Requirements

- A [Telegram Bot](https://t.me/BotFather) and token  
- A Telegram channel where the bot is admin  
- The `TG_Chat_ID` of the target channel (use [@GetTheirIDBot](https://t.me/GetTheirIDBot))  
- A Cloudflare account (for Pages + D1)

---

### 🔐 Environment Variables

| Name             | Description                                  |
|------------------|----------------------------------------------|
| `TG_Bot_Token`   | Your bot token (starts with `bot...`)        |
| `TG_Chat_ID`     | Target channel's chat ID (e.g., `-100xxxx`)  |
| `ADMIN_USERNAME` | Admin panel username                         |
| `ADMIN_PASS`     | Admin panel password                         |
| `WhiteList_Mode` | Set to `true` to enable IP whitelist mode    |
| `WhiteList_IPs`  | Comma-separated IP addresses for whitelist   |

> ✅ After turning on `WhiteList_Mode=true`, only whitelisted images can be displayed.

---

### 🧱 D1 Database Setup

Create a new D1 database and run the following SQL schema:

```sql
CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  list_type TEXT DEFAULT 'None',
  rating_label TEXT DEFAULT 'None',
  liked INTEGER DEFAULT 0,
  timestamp INTEGER
);
Bind the D1 database to the Cloudflare Pages project environment as DB.
## 🗂️ Project Structure

```
/
├─ index.html        # Main upload page
├─ admin.html        # Admin dashboard
├─ /functions/       # Cloudflare Functions backend
├─ /assets/          # CSS, icons, scripts
```

---

## 📜 License

MIT License © 2025 2025 OpenJSW™ / OpenGraphPic Project

````
