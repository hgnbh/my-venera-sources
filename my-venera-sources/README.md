# 我的 Venera 漫画源仓库

这是一个空的 Venera / VeneraNext 漫画源仓库骨架。

## 目录结构

```
.
├── index.json      # 源列表，App 通过这个地址加载所有源
├── example.js     # 模板源（复制后改成你自己的网站）
└── README.md
```

## 使用步骤

### 1. 推送到 GitHub

```bash
cd my-venera-sources
git init
git add .
git commit -m "init"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

### 2. 通过 jsDelivr 生成公开地址

```
https://cdn.jsdelivr.net/gh/你的用户名/你的仓库名@main/index.json
```

### 3. 在 Venera / VeneraNext 里导入

漫画源管理 → 添加仓库 → 粘贴上面的 `index.json` 地址 → 刷新。

### 4. 新增一个源

1. 复制 `example.js`，改名为 `新源.js`
2. 修改里面的 `name` / `key` / `url` / `baseUrl` 和 CSS 选择器
3. 在 `index.json` 里追加一条记录：
   ```json
   {
     "name": "新源名字",
     "fileName": "新源.js",
     "key": "xin_yuan",
     "version": "1.0.0",
     "description": "描述"
   }
   ```
4. push，App 里刷新即可看到。

## 参考文档

- 漫画源编写指南：https://github.com/venera-app/venera/blob/master/doc/comic_source.md
- JavaScript API：https://github.com/venera-app/venera/blob/master/doc/js_api.md
- 官方示例源：https://github.com/venera-app/venera-configs
