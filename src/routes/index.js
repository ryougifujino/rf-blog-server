const Router = require('koa-router');
const router = new Router();
const api = new Router();

const posts = require('./posts-router');
const albums = require('./albums-router');
const comments = require('./comments-router');
const replies = require('./replies-router');

api.use(posts);
api.use(albums);
api.use(comments);
api.use(replies);

router.use('/api', api.routes());

module.exports = router.routes();