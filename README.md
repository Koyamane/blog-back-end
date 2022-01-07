# 山音曦

山音曦博客网站后端项目，基于 [eggjs][egg]

数据库为 mongodb，缓存为 redis，**请都先安装好，不然会报错**

腾讯云存储桶，在 config 文件夹下面，新建一个 cos.config.js 文件，如下。有些文件里的 Bucket 和 Region 也需要换成自己的

```js
// config/cos.config.js
'use strict';

module.exports = {
  SecretId: '你的id',
  SecretKey: '你的密钥',
};

```

[前端传送门][blog-web-site]

### 开发

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### 部署

```bash
$ npm start
$ npm stop
```

[egg]: https://eggjs.org
[blog-web-site]: https://github.com/Koyamane/blog-web-site
