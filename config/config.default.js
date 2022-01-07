/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_16393856704';

  // add your middleware config here
  config.middleware = [ 'gzip', 'errorHandler', 'aseDecryption' ];

  config.errorHandler = {
    match: /\/api\//,
  };

  config.aseDecryption = {
    match: /\/user\//,
  };

  config.gzip = {
    threshold: 1024, // 小于 1k 的响应体不压缩
  };

  config.security = {
    csrf: {
      headerName: 'x-csrf-token', // 通过 header 传递 CSRF token 的默认字段为 x-csrf-token
      useSession: true, // 默认为 false，当设置为 true 时，将会把 csrf token 保存到 Session 中
    },
    // domainWhiteList: [ 'http://localhost:8000', 'http://192.168.1.2:8000' ],
  };

  // config.cors = {
  //   origin: '*',
  //   allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  // };

  // config.session = {
  //   enable: true,
  //   // 操作后，自动刷新 session 持续时间
  //   // renew: true,
  //   maxAge: 24 * 3600 * 1000, // 1 天
  //   httpOnly: true,
  //   encrypt: true,
  // };

  // jwt的密钥
  config.jwt = {
    secret: config.keys,
  };

  config.mongoose = {
    url: process.env.EGG_MONGODB_URL || 'mongodb://127.0.0.1/YamaneSi',
    options: {},
  };

  config.redis = {
    clients: {
      user: { // 存放用户缓存
        port: 6379,
        host: '127.0.0.1',
        password: 'user_redis_202211',
        db: 0, // 单机模式默认库
      },
      other: { // 存放其他缓存
        port: 6379,
        host: '127.0.0.1',
        password: 'user_redis_202211',
        db: 1,
      },
    },
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
