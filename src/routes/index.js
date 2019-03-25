const Router = require('koa-router');
const router = new Router();
const api = new Router();

const posts = require('./posts-router');
const albums = require('./albums-router');

api.use(posts);
api.use(albums);

router.use('/api', api.routes());

module.exports = router.routes();