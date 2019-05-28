const Koa = require('koa');
const koaBody = require('koa-body');
const app = new Koa();
const error =  require('../middleware/error-middleware');

const routes = require('../routes');
app.use(error);
app.use(koaBody());
app.use(routes);

module.exports = app;
