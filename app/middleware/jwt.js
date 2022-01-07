'use strict';

module.exports = (options, app) => {
  return async function jwt(ctx, next) {
    const token = ctx.request.header.authorization;

    if (!token) {
      ctx.status = 401;
      ctx.body = {
        status: 401,
        msg: '请先登录',
      };
      return;
    }

    try {
      // 解码 token，去除 bearer
      const smallUserInfo = app.jwt.verify(token.split(' ')[1], options.secret);
      const userInfo = await ctx.service.cache.redis.get(smallUserInfo.userId);

      if (!userInfo) {
        // 本地存储的过期了
        ctx.status = 401;
        ctx.body = {
          status: 401,
          msg: '登录已过期，需要重新登录',
        };
        return;
      }

      await next();
    } catch (error) {
      ctx.status = 401;
      ctx.body = {
        status: 401,
        msg: error.message === 'invalid token' ? 'token无效' : error.message,
      };
      return;
    }
  };
};
