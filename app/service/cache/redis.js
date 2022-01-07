'use strict';

const BaseService = require('../baseService');

const dbConfig = [ 'user', 'other' ];

class RedisService extends BaseService {
  /**
   * @description 设置缓存
   * @param {String} key 键名
   * @param {*} val 键值
   * @param {Number} expir 有效期，单位：毫秒
   * @param {0 | 1} db 缓存库
   */
  async set(key, val, expir = 0, db = 0) {
    const { redis } = this.app;
    const dbRedis = redis.clients.get(dbConfig[db]);

    if (!expir) {
      // 不会影响已设置的值的时间，只会改变
      return await dbRedis.set(key, JSON.stringify(val));
    }

    // EX 是秒，PX 是毫秒
    return await dbRedis.set(key, JSON.stringify(val), 'PX', expir);
  }

  /**
   * @description 删除缓存
   * @param {String} key 键名
   * @param {0 | 1} db 缓存库
   */
  async del(key, db = 0) {
    const { redis } = this.app;
    const dbRedis = redis.clients.get(dbConfig[db]);
    return await dbRedis.del(key);
  }

  /**
   * @description 获取缓存
   * @param {String} key 键名
   * @param {0 | 1} db 缓存库
   */
  async get(key, db = 0) {
    const { redis } = this.app;
    const cacheStr = await redis.clients.get(dbConfig[db]).get(key);
    return JSON.parse(cacheStr);
  }
}

module.exports = RedisService;
