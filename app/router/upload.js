'use strict';

module.exports = (app, jwt) => {
  // app.router.post('/upload/api/images', jwt, 'upload.uploadImages');
  app.router.put('/upload/api/avatar', jwt, 'upload.changeAvatar');
};
