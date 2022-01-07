'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hellow koyamane';
  }
  async crsfKey() {
    const { ctx } = this;
    ctx.body = ctx.csrf;
  }
}

module.exports = HomeController;
