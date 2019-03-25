const Koa = require('koa');
const koaBody = require('koa-body');
const app = new Koa();

const routes = require('../routes');
app.use(koaBody());
app.use(routes);

module.exports = app;