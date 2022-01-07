'use strict';

const MyError = require('./myError');
const BaseService = require('./baseService');

class UserService extends BaseService {
  get document() {
    return this.ctx.model.User;
  }

  async login() {
    const { app, ctx } = this;

    const params = ctx.request.body || {};

    if (!params.username) {
      return Promise.reject(new MyError('用户名未传', 400));
    }

    if (!params.password) {
      return Promise.reject(new MyError('密码未传', 400));
    }

    const userInfo = await this.document.findOne({ username: params.username, password: params.password }, { password: 0, _id: 0 });

    if (!userInfo) {
      return Promise.reject(new MyError('用户名或密码错误', 400));
    }

    const token = app.jwt.sign(
      { userId: userInfo.userId },
      app.config.jwt.secret
    );

    // 以用户名存好，并设置好过期时间
    await ctx.service.cache.redis.set(userInfo.userId, userInfo, app.config.session.maxAge);

    // 如果用户勾选了 `记住我`，设置 30 天的过期时间
    if (params.rememberMe) {
      await ctx.service.cache.redis.set('userInfo', userInfo, 1000 * 60 * 60 * 24 * 30);
    }

    return {
      token,
      userInfo,
    };
  }

  async register() {
    const { app, ctx } = this;

    const params = ctx.request.body || {};

    if (!params.username) {
      return Promise.reject(new MyError('用户名未传', 400));
    }

    if (params.username.length < 6 || params.username.length > 16) {
      return Promise.reject(new MyError('用户名必须在6~16个字符之间', 400));
    }

    if (!params.password) {
      return Promise.reject(new MyError('密码未传', 400));
    }

    if (params.password.length < 6 || params.password.length > 16) {
      return Promise.reject(new MyError('密码必须在6~16个字符之间', 400));
    }

    const isHas = await this.document.findOne({ username: params.username });

    if (isHas) {
      return Promise.reject(new MyError('用户名已存在，换个用户名吧', 400));
    }

    const userInfo = await this.document.create({
      username: params.username,
      password: params.password,
      nickname: params.username,
      avatar: 'https://yamanesi-1258339807.cos.ap-guangzhou.myqcloud.com/avatar%2Fdefault_avatar.png?q-sign-algorithm=sha1&q-ak=AKID1h-9r4qi7EqiBcN68wCv3clM9S7B4y9pwb6cVz6LdgrFwlBwQaCG5RW6uhO8zyKa&q-sign-time=1641546762;1641550362&q-key-time=1641546762;1641550362&q-header-list=&q-url-param-list=&q-signature=3cb964b57a44f9cc01581b1634f838205aea23bb&x-cos-security-token=9bPq270tt0IfyyoJtuPPvZeAO3P17MMaa2ab203e9d953ec654bbda7c4a9237afa9lRLC2-5v4-ze1CJjHIHxoi-SLqpsM87zmHNvmfPxoh-FJj9r56ZsLaj7RwgY-9rakS571LDYnl_eXM1xKlRQWXkgs68N6bzZCIew6W-rAI5NTx3jIT5SerJ-RMSI42NZdr-OUytTdayW16jPlINSOUDaXsg9SfZ0lZJpiVUtLu5vRi-k_1Rj9gpu-qTc1x',
    });

    const token = app.jwt.sign(
      { userId: userInfo.userId },
      app.config.jwt.secret
    );

    // 前端不需要_id和password
    const userInfo2 = JSON.parse(JSON.stringify(userInfo));
    userInfo2.password = undefined;
    userInfo2._id = undefined;
    delete userInfo2.password;
    delete userInfo2._id;

    // 以用户名存好，并设置好过期时间
    await ctx.service.cache.redis.set(userInfo2.userId, userInfo2, app.config.session.maxAge);

    return {
      token,
      userInfo: userInfo2,
    };
  }

  async logOut() {
    const { ctx } = this;

    const userInfo = await ctx.getCurrentUserInfo();

    await ctx.service.cache.redis.del(userInfo.userId);

    return '已退出登录';
  }

  async updateCurrent(defaultParams) {
    const { ctx } = this;
    const params = { ...defaultParams, ...ctx.request.body };

    if (!Object.keys(params).length) {
      return {};
    }

    if (params.nickname) {
      if (/^\s*$/.test(params.nickname)) {
        return Promise.reject(new MyError('昵称不能全是空格', 400));
      }

      if (params.nickname.length > 30) {
        return Promise.reject(new MyError('昵称不能大于30个字符', 400));
      }
    }

    if (Array.isArray(params.tags) && params.tags.some(item => item.length > 20)) {
      return Promise.reject(new MyError('单个标签长度不能大于20', 400));
    }

    const userInfo = await ctx.getCurrentUserInfo();

    const filterArr = [ '_id', 'access', 'username', 'password', 'userId', 'createdDate', 'updateDate', 'notifyCount', 'unreadCount' ];

    const updateData = {};
    for (const key in params) {
      if (Object.hasOwnProperty.call(params, key) && !filterArr.includes(key)) {
        updateData[key] = params[key];
      }
    }

    updateData.updateDate = new Date();

    await this.document.updateOne({ userId: userInfo.userId }, { $set: updateData });

    await ctx.service.cache.redis.set(userInfo.userId, { ...userInfo, ...updateData });

    return '修改成功';
  }

  async updateCurrentPassword(defaultParams) {
    const { ctx } = this;
    const { password } = { ...defaultParams, ...ctx.request.body };

    if (!password) {
      return Promise.reject(new MyError('请传入要更改的密码', 400));
    }

    if (password.length < 6 || password.length > 16) {
      return Promise.reject(new MyError('密码必须在6~16个字符之间', 400));
    }

    const userInfo = await ctx.getCurrentUserInfo();

    await this.document.updateOne({ userId: userInfo.userId }, { $set: { password, updateDate: new Date() } });

    return '修改成功';
  }

  async userInfo(defaultParams) {
    const { ctx } = this;
    const params = { ...defaultParams, ...ctx.request.body };

    if (!Object.keys(params).length) {
      // 没传值就返回当前用户
      return ctx.getCurrentUserInfo();
    }

    const userInfo = await this.document.findOne(params, { password: 0, _id: 0 });
    return userInfo || {};
  }
}

module.exports = UserService;
