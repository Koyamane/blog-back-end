'use strict';

module.exports = app => {
  const { mongoose } = app;

  const blogSchema = new mongoose.Schema(
    {
      id: {
        type: Number,
        unique: true,
        require: true,
        default: () => app.createUuid(6, 10), // 用函数的方法，就不会每次都是固定值了
      },
      createdName: { type: String, default: '' },
      createdId: { type: String, default: '' },
      createdAvatar: { type: String, default: '' },
      createdDate: { type: Date, default: () => new Date() },
      updateDate: { type: Date, default: () => new Date() },
      editor: {
        type: String,
        validate: str => {
          // 必须全是 RICH_TEXT 和 MARKDOWN
          return [ 'RICH_TEXT', 'MARKDOWN' ].includes(str);
        },
        default: 'RICH_TEXT',
      },
      title: { type: String, default: '' },
      content: { type: String, default: '' },
      mdData: { type: String, default: '' },
      previewImg: { type: String, default: '' },
      tags: {
        type: Array,
        validate: arr => {
          // 必须全是 string
          return arr.every(item => typeof item === 'string');
        },
        default: [],
      },
      reads: { type: Number, min: 0, default: 0 },
      likes: { type: Number, min: 0, default: 0 },
      collections: { type: Number, min: 0, default: 0 },
    },
    { versionKey: false }
  );

  return mongoose.model('Blog', blogSchema);
};
