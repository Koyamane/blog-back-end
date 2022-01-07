'use strict';

module.exports = (app, jwt) => {
  app.router.post('/blog/api/page', 'blog.blogList');
  app.router.post('/blog/api/page/:userId', 'blog.somebodyBlogList');
  app.router.post('/blog/api/add', jwt, 'blog.addBlog');
  app.router.delete('/blog/api/delete', jwt, 'blog.deleteBlog');
  app.router.put('/blog/api/update', jwt, 'blog.updateBlog');
  app.router.get('/blog/api/info', 'blog.blogInfo');
};
