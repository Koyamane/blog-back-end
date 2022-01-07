'use strict';

module.exports = (app, jwt) => {
  app.router.post('/user/api/login', 'user.login');
  app.router.post('/user/api/register', 'user.register');
  app.router.post('/user/api/info', jwt, 'user.userInfo');
  app.router.get('/user/api/logOut', jwt, 'user.logOut');
  app.router.put('/user/api/current/update', jwt, 'user.updateCurrent');
  app.router.put('/user/api/current/update/passowrd', jwt, 'user.updateCurrentPassword');
};
