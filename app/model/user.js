'use strict';

module.exports = app => {
  const { mongoose } = app;

  const userSchema = new mongoose.Schema(
    {
      username: { type: String, unique: true, require: true, trim: true },
      userId: {
        type: String,
        unique: true,
        require: true,
        default: () => app.createUuid(10, 10),
      },
      createdDate: { type: Date, default: () => new Date() },
      updateDate: { type: Date, default: () => new Date() },
      password: { type: String, require: true, trim: true },
      nickname: { type: String, trim: true, default: '' },
      avatar: {
        type: String,
        default: 'https://yamanesi-1258339807.cos.ap-guangzhou.myqcloud.com/avatar%2Fdefault_avatar.png',
      },
      post: { type: String, trim: true, default: '' }, // 岗位
      signature: { type: String, trim: true, default: '' }, // 个性签名
      tags: {
        type: Array,
        validate: arr => {
          // 必须全是 string
          return arr.every(item => typeof item === 'string');
        },
        default: [],
      },
      notifyCount: { type: Number, default: 0 }, // 消息数
      unreadCount: { type: Number, default: 0 }, // 未读数
      email: { type: String, trim: true, default: '' },
      phone: { type: String, trim: true, default: '' },
      country: {
        type: Object,
        validate: data => {
          if (!data.label) return false;
          if (!data.value) return false;
          return true;
        },
        default: { value: 'China', label: '中国' },
      },
      area: {
        type: Array,
        validate: arr => {
          // 必须全是 string
          return arr.every(item => typeof item === 'string');
        },
        default: [],
      },
      access: { type: String, trim: true, default: 'user' },
      address: { type: String, default: '' },
    },
    { versionKey: false }
  );

  return mongoose.model('User', userSchema);
  // 第三个参数不传，则生成 users 表，传了就是指定表名
  // return mongoose.model('User', userSchema, 'user');
};
