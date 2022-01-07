'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  // 这里不传 app，中间件里面就没有
  const jwt = app.middleware.jwt(app.config.jwt, app);

  router.get('/', controller.home.index);
  router.get('/home/api/crsf', controller.home.crsfKey);
  require('./router/blog')(app, jwt);
  require('./router/user')(app, jwt);
  require('./router/upload')(app, jwt);
};
