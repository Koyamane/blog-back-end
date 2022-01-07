'use strict';

const Controller = require('egg').Controller;

class BlogController extends Controller {
  async login() {
    const { ctx } = this;
    await ctx.returnService(ctx.service.user.login());
  }

  async register() {
    const { ctx } = this;
    await ctx.returnService(ctx.service.user.register());
  }

  async logOut() {
    const { ctx } = this;
    await ctx.returnService(ctx.service.user.logOut());
  }

  async updateCurrent() {
    const { ctx } = this;
    await ctx.returnService(ctx.service.user.updateCurrent());
  }

  async updateCurrentPassword() {
    const { ctx } = this;
    await ctx.returnService(ctx.service.user.updateCurrentPassword());
  }

  async userInfo() {
    const { ctx } = this;
    await ctx.returnService(ctx.service.user.userInfo());
  }
}

module.exports = BlogController;
