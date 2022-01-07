'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/home.test.js', () => {
  it('should GET /', () => {
    return app.httpRequest().get('/').expect('hellow world')
      .expect(200);
  });
  it('should POST /home/api/blog/page', () => {
    return app
      .httpRequest()
      .post('/home/api/blog/page')
      .send({}) // 这里放请求参数
      .expect(200)
      .then(response => {
        // response.text 是返回的 body 字符串，转成 json 后再通过 assert 校验
        const res = JSON.parse(response.text);
        assert(res.list);
      });
  });
});
