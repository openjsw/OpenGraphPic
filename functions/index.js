export async function onRequestGet({ env }) {
  // 支持环境变量配置
  const SEO_TITLE = env.SEO_TITLE || 'OpenGraphPic | 开放图像';
  const SEO_DESCRIPTION = env.SEO_DESCRIPTION || 'OpenGraphPic 是一个开源图床解决方案，借助 Telegraph 平台作为图像后端，提供轻量、无注册、匿名上传体验。支持直接上传图片并生成永久直链，适用于博客文章、社交媒体分享、Markdown 文档等场景。';

  return new Response(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>${SEO_TITLE}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${SEO_DESCRIPTION}">
  <style>
    html, body { height: 100%; margin: 0; padding: 0; background: #f7f7f7; }
    body {
      min-height: 100vh; width: 100vw; display: flex; flex-direction: column;
      justify-content: center; align-items: center;
      font-family: "Segoe UI", "PingFang SC", "Hiragino Sans GB", Arial, sans-serif;
      box-sizing: border-box; position: relative; overflow-x: hidden;
    }
    .topbar { position: absolute; top: 18px; right: 20px; display: flex; gap: 12px; z-index: 2; }
    .icon-btn { background: none; border: none; cursor: pointer; padding: 6px; border-radius: 50%; transition: background 0.2s; display: flex; align-items: center; justify-content: center; }
    .icon-btn:focus { outline: 2px solid #1741a2; background: #eaf0fd; }
    .icon-btn:hover { background: #eaf0fd; }
    .container { background: #fff; padding: 32px 24px 28px 24px; border-radius: 18px; box-shadow: 0 4px 24px rgba(44,59,103,0.07); max-width: 380px; width: 96vw; text-align: center; margin-top: 0; margin-bottom: 0; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 0; }
    h2 { margin-bottom: 18px; color: #1b254b; font-weight: 700; font-size: 1.28rem; letter-spacing: .02em; }
    .file-input { margin: 14px 0 10px 0; }
    .btn { background: #1741a2; color: #fff; border: none; padding: 10px 28px; border-radius: 7px; font-size: 16px; cursor: pointer; margin-top: 10px; transition: background 0.18s; box-shadow: 0 1px 6px rgba(0,0,0,0.03); }
    .btn:disabled { background: #bcd7fa; color: #666; cursor: not-allowed; }
    .copy-btn { background: #10b981; margin-left: 8px; padding: 7px 16px; font-size: 14px; color: #fff; border-radius: 6px; }
    .progress-bar { width: 100%; background: #f0f3fa; border-radius: 8px; margin-top: 18px; height: 10px; overflow: hidden; box-shadow: 0 1px 3px rgba(44,59,103,0.04); }
    .progress-inner { height: 100%; background: linear-gradient(90deg,#1741a2 60%,#2563eb 100%); width: 0; transition: width 0.3s; }
    .tip { color: #434850; font-size: 13.5px; margin-top: 8px; }
    .preview-img { margin-top: 14px; max-width: 99%; border-radius: 8px; box-shadow: 0 1px 6px rgba(0,0,0,0.09);}
    .result { margin-top: 22px; word-break: break-word; width: 100%;}
    @media (max-width: 520px) {
      .container { padding: 20px 4vw 16px 4vw; max-width: 98vw; min-width: 0; border-radius: 12px; }
      .topbar { top: 8px; right: 8px; gap: 8px; }
      h2 { font-size: 1rem;}
    }
    input[type="file"]::-webkit-file-upload-button { visibility: hidden;}
    input[type="file"]::before { content: attr(title); display: inline-block; background: #e3e9fa; border: 1px solid #b3c0de; border-radius: 6px; padding: 6px 18px; outline: none; white-space: nowrap; user-select: none; cursor: pointer; font-size: 15px; color: #1741a2; transition: background 0.18s;}
    input[type="file"]:hover::before { background: #d6e4ff;}
    input:focus, select:focus, button:focus { outline: 2px solid #1741a2; outline-offset: 2px;}
  </style>
</head>
<body>
  <div class="topbar" role="toolbar">
    <button class="icon-btn" id="langSwitcherBtn" aria-label="切换语言" title="切换语言">
      <img src="/img/language.png" width="24" height="24" alt="语言切换" />
    </button>
    <a href="/admin" class="icon-btn" id="adminBtn" aria-label="后台管理" title="后台管理">
      <img src="/img/setting.png" width="24" height="24" alt="后台管理" />
    </a>
  </div>
  <div class="container" aria-labelledby="uploadTitle">
    <h2 id="uploadTitle">请上传图片</h2>
    <div class="file-input">
      <label for="fileInput" id="fileInputLabel" style="font-weight:500;margin-bottom:6px;display:block;">选择文件</label>
      <input type="file" id="fileInput" aria-labelledby="fileInputLabel" title="选择文件">
    </div>
    <button class="btn" id="uploadBtn" onclick="uploadFile()" aria-label="上传文件">上传文件</button>
    <div class="tip" id="uploadTip">支持图片/音频/视频/文档，最大 5MB</div>
    <div class="progress-bar" id="progressBar" style="display:none;" aria-hidden="true">
      <div class="progress-inner" id="progressInner"></div>
    </div>
    <div class="result" id="result" aria-live="polite"></div>
  </div>
  <script>
    // 语言包
    const i18nMap = {
      zh: {
        uploadTitle: "请上传图片",
        uploadBtn: "上传文件",
        tip: "支持图片/音频/视频/文档，最大 5MB",
        uploading: "上传中...",
        fileTooLarge: "文件不能超过 5MB",
        noFile: "请选择文件",
        uploadSuccess: "上传成功！",
        uploadFailed: "上传失败：未获取到返回链接",
        formatError: "上传失败：响应格式错误",
        networkError: "上传失败：网络错误",
        copied: "已复制到剪贴板",
        copyLink: "复制链接",
        whitelistPreview: "图片未在白名单中，暂无法预览。",
        selectFile: "选择文件",
        selectLang: "选择语言",
        admin: "后台管理",
        langTip: "切换语言"
      },
      en: {
        uploadTitle: "Please upload pictures",
        uploadBtn: "Upload File",
        tip: "Supports images/audio/video/docs, max size 5MB",
        uploading: "Uploading...",
        fileTooLarge: "File size exceeds 5MB",
        noFile: "Please select a file",
        uploadSuccess: "Upload successful!",
        uploadFailed: "Upload failed: No link returned",
        formatError: "Upload failed: Invalid response format",
        networkError: "Upload failed: Network error",
        copied: "Copied to clipboard",
        copyLink: "Copy Link",
        whitelistPreview: "This image is not in the whitelist and cannot be previewed.",
        selectFile: "Select file",
        selectLang: "Select language",
        admin: "Manage",
        langTip: "Switch language"
      }
    };
    let langState = 'zh';
    function switchLang(lang) {
      langState = lang;
      document.getElementById('uploadTitle').textContent = i18nMap[lang].uploadTitle;
      document.getElementById('uploadBtn').textContent = i18nMap[lang].uploadBtn;
      document.getElementById('uploadTip').textContent = i18nMap[lang].tip;
      document.getElementById('fileInputLabel').textContent = i18nMap[lang].selectFile;
      document.getElementById('adminBtn').setAttribute('aria-label', i18nMap[lang].admin);
      document.getElementById('adminBtn').setAttribute('title', i18nMap[lang].admin);
      document.getElementById('langSwitcherBtn').setAttribute('title', i18nMap[lang].langTip);
      document.getElementById('langSwitcherBtn').setAttribute('aria-label', i18nMap[lang].langTip);
    }
    document.getElementById('langSwitcherBtn').onclick = () => {
      switchLang(langState === 'zh' ? 'en' : 'zh');
    };
    function getI18n(key) {
      return i18nMap[langState][key] || key;
    }
    // 上传逻辑
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const resultDiv = document.getElementById('result');
    const progressBar = document.getElementById('progressBar');
    const progressInner = document.getElementById('progressInner');
    const UPLOAD_API = '/upload';
    function resetUI() {
      resultDiv.innerHTML = '';
      progressBar.style.display = 'none';
      progressInner.style.width = '0';
    }
    fileInput.addEventListener('change', resetUI);
    function showProgress(percent) {
      progressBar.style.display = 'block';
      progressInner.style.width = percent + '%';
    }
    async function uploadFile() {
      resetUI();
      if (!fileInput.files.length) {
        resultDiv.innerHTML = \`<span style="color:#e11d48;">\${getI18n("noFile")}</span>\`;
        return;
      }
      const file = fileInput.files[0];
      if (file.size > 5 * 1024 * 1024) {
        resultDiv.innerHTML = \`<span style="color:#e11d48;">\${getI18n("fileTooLarge")}</span>\`;
        return;
      }
      uploadBtn.disabled = true;
      showProgress(10);
      resultDiv.innerHTML = getI18n("uploading");
      const formData = new FormData();
      formData.append('file', file);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', UPLOAD_API, true);
      xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
          let percent = Math.round((e.loaded / e.total) * 80) + 10;
          if (percent > 90) percent = 90;
          showProgress(percent);
        }
      };
      xhr.onload = function() {
        uploadBtn.disabled = false;
        showProgress(100);
        try {
          const data = JSON.parse(xhr.responseText);
          if (Array.isArray(data) && data[0]?.src) {
            const host = window.location.origin;
            const url = host + data[0].src;
            const ext = url.split('.').pop().toLowerCase();
            let preview = '';
            if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
              preview = \`<img src="\${url}" class="preview-img"
                onerror="this.onerror=null;this.style.display='none';document.getElementById('result').insertAdjacentHTML('beforeend','<div style=\\\\'color:#e11d48; margin-top:12px;\\\\'>\${getI18n('whitelistPreview')}</div>');" alt="图片预览">\`;
            } else if (['mp4', 'webm', 'ogg'].includes(ext)) {
              preview = \`<video controls class="preview-img" src="\${url}"
                onerror="this.onerror=null;this.style.display='none';document.getElementById('result').insertAdjacentHTML('beforeend','<div style=\\\\'color:#e11d48; margin-top:12px;\\\\'>\${getI18n('whitelistPreview')}</div>');" aria-label="视频预览"></video>\`;
            } else if (['mp3', 'wav', 'aac'].includes(ext)) {
              preview = \`<audio controls class="preview-img" src="\${url}"
                onerror="this.onerror=null;this.style.display='none';document.getElementById('result').insertAdjacentHTML('beforeend','<div style=\\\\'color:#e11d48; margin-top:12px;\\\\'>\${getI18n('whitelistPreview')}</div>');" aria-label="音频预览"></audio>\`;
            }
            resultDiv.innerHTML = \`
              <div style="margin-bottom: 10px; font-weight: 500; color: #059669;">\${getI18n("uploadSuccess")}</div>
              <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 8px;">
                <a href="\${url}" target="_blank" style="color: #1741a2; word-break: break-all;">\${url}</a>
                <button class="btn copy-btn" onclick="copyLink('\${url}')" aria-label="\${getI18n('copyLink')}">\${getI18n("copyLink")}</button>
              </div>
              <div>\${preview}</div>
            \`;
          } else {
            resultDiv.innerHTML = \`<span style="color:#e11d48;">\${getI18n("uploadFailed")}</span>\`;
          }
        } catch (e) {
          resultDiv.innerHTML = \`<span style="color:#e11d48;">\${getI18n("formatError")}</span>\`;
        }
      };
      xhr.onerror = function() {
        uploadBtn.disabled = false;
        resultDiv.innerHTML = \`<span style="color:#e11d48;">\${getI18n("networkError")}</span>\`;
      };
      xhr.send(formData);
    }
    function copyLink(url) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          alert(getI18n("copied"));
        });
      } else {
        const input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        alert(getI18n("copied"));
      }
    }
    switchLang('zh');
  </script>
</body>
</html>
`, {
    headers: { 'content-type': 'text/html; charset=utf-8' }
  });
}
