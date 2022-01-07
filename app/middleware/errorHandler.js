'use strict';

module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
    } catch (error) {
      // 这个函数经常没有。先注释了
      // 所有的异常都在app上出发一个 error 事件，框架会记录一条错误日志
      // ctx.app.emi('error', error, ctx);
      const status = error.status || 500;

      // 生产环境 500 错误不返回给客户端，因为可能包含敏感信息
      const msg = status === 500 && ctx.app.config.env === 'prod' ? 'Internal Server Error' : error.message;

      // 这个是让接口返回报错的，不写就是200
      ctx.status = status;

      ctx.body = {
        msg,
        status,
        // data: [],
      };
    }
  };
};
