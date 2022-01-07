'use strict';

const Controller = require('egg').Controller;

class UploadController extends Controller {
  // 多张图片
  async uploadImages() {
    const { ctx } = this;
    await ctx.returnService(ctx.service.upload.uploadImages());
  }
  // 更换头像
  async changeAvatar() {
    const { ctx } = this;
    await ctx.returnService(ctx.service.upload.changeAvatar());
  }
}

module.exports = UploadController;
