'use strict';

const MyError = require('./myError');
const BaseService = require('./baseService');

class UserService extends BaseService {
  get document() {
    return this.ctx.model.Blog;
  }

  async queryBlogPage(defaultParams) {
    const userInfo = await this.ctx.getCurrentUserInfo();

    const cb = userInfo && (list => {
      return list.map(item => {
        item.createdAvatar = userInfo.avatar;
        item.createdName = userInfo.nickname;
        return item;
      });
    });

    return this.queryPage(defaultParams, cb);
  }

  async addBlog(defaultParams) {
    const params = { ...defaultParams, ...this.ctx.request.body };

    if (!params.title) {
      return Promise.reject(new MyError('标题为必传', 400));
    }

    if (/^\s*$/.test(params.title)) {
      return Promise.reject(new MyError('标题不能全是空格', 400));
    }

    if (Array.isArray(params.tags) && params.tags.some(item => item.length > 20)) {
      return Promise.reject(new MyError('单个标签长度不能大于20', 400));
    }

    params.cover = await this.uploadFile('cover/cover_');

    // tags是数组，但是在formData中会自动用转成字符串并且用都好隔开，要手动转
    params.tags = params.tags ? params.tags.split(',') : [];

    const data = await this.document.create(params);

    return {
      id: data.id,
      msg: '新增成功',
    };
  }

  async deleteBlog(defaultParams) {
    const params = { ...defaultParams, ...this.ctx.request.body };
    await this.deleteSomeone(params);
  }

  async updateBlog(defaultParams) {
    const params = { ...defaultParams, ...this.ctx.request.body, updateDate: new Date() };

    if (!params.id) {
      return Promise.reject(new MyError('请传入ID', 400));
    }

    if (!params.title) {
      return Promise.reject(new MyError('标题为必传', 400));
    }

    if (/^\s*$/.test(params.title)) {
      return Promise.reject(new MyError('标题不能全是空格', 400));
    }

    if (Array.isArray(params.tags) && params.tags.some(item => item.length > 20)) {
      return Promise.reject(new MyError('单个标签长度不能大于20', 400));
    }

    // tags是数组，但是在formData中会自动用转成字符串并且用都好隔开，要手动转
    params.tags = params.tags ? params.tags.split(',') : [];

    if (!params.cover) {
      let preUrl;
      // 存在就说明是字符串，不是 file
      const blogInfo = await this.someoneInfo({ id: params.id });
      // 获取前文件路径
      if (blogInfo.cover) {
        preUrl = blogInfo.cover.split('?')[0].replace(/.*\//, '');
      }

      params.cover = await this.uploadFile('cover/cover_', preUrl && ('cover/' + preUrl));
    }

    await this.document.updateOne(
      { id: params.id },
      { $set: params }
    );

    return '修改成功';
  }

  async blogInfo(defaultParams) {
    const params = { ...defaultParams, ...this.ctx.request.query };
    const blogInfo = await this.someoneInfo(params);

    if (!blogInfo) {
      return Promise.reject(new MyError('该博文不存在', 400));
    }

    blogInfo.reads++;

    await this.document.updateOne({ id: blogInfo.id }, { $set: { reads: blogInfo.reads } });

    return blogInfo;
  }

  async somebodyBlogList(defaultParams) {
    const { userId } = { ...this.ctx.params };

    if (!userId) {
      return Promise.reject(new MyError('未找到用户', 400));
    }

    return this.queryPage({ ...defaultParams, dto: { createdId: userId } });
  }
}

module.exports = UserService;
