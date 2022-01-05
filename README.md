# 头像挂件工坊
### 素材添加
- 图片资源预先处理成正方形300*300即可，不够补透明
- 压缩后上传到七牛（或其他图床）
- 更新config.imgList.js，图床uri部分添加到对应的节日数组内

### 云调用

> https://rongsp.com/article/193.html#top
> https://bwmelon.com/archives/41/

- 本地打包安装依赖
```
npm install copy-webpack-plugin@5.1.1 -s
```

- 云函数sdk更新
```
cd cloudfunctions/check
npm install --save wx-server-sdk@latest
```

- 微信工具里进行同步云函数