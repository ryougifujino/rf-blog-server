const Router = require('koa-router');
const router = new Router();
const api = new Router();

const posts = require('./posts-router');

api.use(posts);

router.use('/api', api.routes());

module.exports = router.routes();