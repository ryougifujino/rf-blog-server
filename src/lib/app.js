const Koa = require('koa');
const app = new Koa();

const routes = require('../routes');

app.use(routes);

module.exports = app;