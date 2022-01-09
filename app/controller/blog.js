'use strict';

const Controller = require('egg').Controller;

class BlogController extends Controller {
  async blogList() {
    const { ctx } = this;
    await ctx.returnService(ctx.service.blog.queryBlogPage({ sort: { updateDate: -1 } }));
  }

  async addBlog() {
    const { ctx } = this;
    const userInfo = await ctx.getCurrentUserInfo();

    await ctx.returnService(ctx.service.blog.addBlog({
      createdAvatar: userInfo.avatar,
      createdName: userInfo.nickname,
      createdUser: userInfo.username,
      createdId: userInfo.userId,
    }));
  }

  async deleteBlog() {
    const { ctx } = this;
    await ctx.returnService(ctx.service.blog.deleteBlog());
  }

  async updateBlog() {
    const { ctx } = this;
    await ctx.returnService(ctx.service.blog.updateBlog());
  }

  async blogInfo() {
    const { ctx } = this;
    await ctx.returnService(ctx.service.blog.blogInfo());
  }

  async somebodyBlogList() {
    const { ctx } = this;
    await ctx.returnService(ctx.service.blog.somebodyBlogList({ sort: { updateDate: -1 } }));
  }
}

module.exports = BlogController;
