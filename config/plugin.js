'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // 设置为 false 可以关闭cors 跨域
  // cors: {
  //   enable: true,
  //   package: 'egg-cors',
  // },

  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },

  redis: {
    enable: true,
    package: 'egg-redis',
  },

  jwt: {
    enable: true,
    package: 'egg-jwt',
  },
};
