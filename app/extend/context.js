'use strict';

module.exports = {
  /**
   * @description 根据当前请求token，返回对应用户详情
   */
  async getCurrentUserInfo() {
    const token = this.request.header.authorization;
    const smallUserInfo = this.app.jwt.verify(token.split(' ')[1], this.app.config.jwt.secret);
    const userInfo = await this.service.cache.redis.get(smallUserInfo.userId);
    return userInfo;
  },

  /**
   * @description 使用时必须加 await
   * @param {Promise} servicePromise
   */
  async returnService(servicePromise) {
    const [ error, data ] = await this.wapperError(servicePromise);

    if (error) {
      const status = error.status || 500;
      this.status = status;
      this.body = {
        status,
        msg: error.message || error,
      };
    } else {
      this.body = {
        status: 200,
        data,
      };
    }

    return this.body;
  },

  wapperError(promise) {
    return promise
      .then(data => {
        return [ undefined, data ];
      })
      .catch(err => [ err ]);
  },
};
