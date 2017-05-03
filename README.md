# 关联 有道云笔记 插件开发手册

该插件支持将 有道云笔记 关联到 Teambition 任务/分享/日程等上面

## 配置文件
```json
{
  "name": "Youdao Notes App For Teambition",
  "host": "http://example.com",
  "youdao": {
    "client_id": "",
    "client_secret": "",
    "redirect_uri": "",
    "description": ""
  },
  "app": {
    "client_id": "",
    "client_secret": "",
    "description": "创建 teambition 应用，并配置 client_id & client_secret"
  }
}
```

## Notes 效果图

获取 笔记本 列表
![](./images/notebook_list.jpeg)

获取 笔记 列表
![](./images/notes_list.jpeg)

## 事例开发手册

[前往](./tutorial.md)

# License

MIT
