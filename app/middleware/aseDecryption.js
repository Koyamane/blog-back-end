'use strict';

module.exports = (options, app) => {
  return async function aseDecryption(ctx, next) {
    let password = ctx.request.body.password;

    try {
      if (password) {
        password = app.decryption(password);
        ctx.request.body.password = password;
      }
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        msg: error.message || '密码格式不正确',
      };

      return;
    }
    await next();
  };
};
