'use strict';

const awaitWriteStream = require('await-stream-ready').write; // 用于异步操作文件
const sendToWormhole = require('stream-wormhole'); // 用于关闭文件流
const fs = require('fs');
const path = require('path');
// const MyError = require('./myError');
const BaseService = require('./baseService');
const cosConfig = require('../../config/cos.config');

const COS = require('cos-nodejs-sdk-v5');
// 创建实例
const cos = new COS(cosConfig);

class UserService extends BaseService {
  get document() {
    return this.ctx.model.User;
  }

  // 用户更换头像
  async changeAvatar() {
    const { ctx } = this;

    const stream = await ctx.getFileStream();
    // path.extname(filename) 也能拿到文件后缀
    const fileType = stream.mimeType.split('/')[1];
    const filename = 'avatar/avatar_' + Date.now() + '.' + fileType || stream.filename.toLowerCase();

    // 上传
    await cos.putObject({
      Bucket: 'yamanesi-1258339807',
      Region: 'ap-guangzhou',
      Key: filename,
      Body: stream, // 上传文件对象
    });

    // 获取地址
    const imgUrl = await cos.getObjectUrl({
      Bucket: 'yamanesi-1258339807',
      Region: 'ap-guangzhou',
      Key: filename, // 传到avatar文件夹下面
      Sign: true, /* 获取带签名的对象URL */
    });
    const avatarUrl = imgUrl + (imgUrl.indexOf('?') > -1 ? '&' : '?') + 'response-content-disposition=attachment'; // 补充强制下载的参数
    const userInfo = await ctx.getCurrentUserInfo();
    const preAvatar = userInfo.avatar.split('?')[0].replace(/.*\//, '');

    await this.document.updateOne({ userId: userInfo.userId }, { $set: { avatar: avatarUrl } });
    // 更新缓存
    await ctx.service.cache.redis.set(userInfo.userId, { ...userInfo, avatar: avatarUrl });

    if (preAvatar !== 'default_avatar.png') {
      // 异步删除，失败了也不要紧
      cos.deleteObject({
        Bucket: 'yamanesi-1258339807',
        Region: 'ap-guangzhou',
        Key: 'avatar/' + preAvatar,
      });
    }

    return avatarUrl;
  }

  // 上传多张图片，这里可以上传别的文件，到时候改改
  async uploadImages() {
    const { ctx } = this;
    const parts = ctx.multipart({ autoFields: true });
    const urls = [];
    let stream;

    while ((stream = await parts()) != null) {
      const fileType = stream.mimeType.split('/')[1];
      const filename = 'file_' + Date.now() + '.' + fileType || stream.filename.toLowerCase();

      const target = path.join(
        this.config.baseDir,
        'app/public/img',
        filename
      );

      const netPath = path.join('/public/img', filename);

      // 创建写入流，对文件流进行写入操作，第一个参数为路径
      const writeStream = fs.createWriteStream(target);

      try {
        // 异步把文件流写入
        await awaitWriteStream(stream.pipe(writeStream));
        // 后端处理地址是会将/转成\\，所以这里要将 \\ 转成 / 再返回给前端
        urls.push(ctx.origin + netPath.replace(/\\/g, '/'));
        // 网络上访问，是 http://域名/public/img/xxx.png
      } catch (error) {
        // 如果出现错误，关闭管道
        await sendToWormhole(stream);
        throw error;
      }
    }

    // 这个地址没有http等前缀
    return urls;
  }
}

module.exports = UserService;
