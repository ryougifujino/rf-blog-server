const Router = require('koa-router');
const router = new Router();
const api = new Router();

const token = require('./token-router');
const posts = require('./posts-router');
const albums = require('./albums-router');
const comments = require('./comments-router');
const replies = require('./replies-router');
const shares = require('./shares-router');
const shareCategories = require('./share-categories-router');
const tags = require('./tags-router');

api.use(token);
api.use(posts);
api.use(albums);
api.use(comments);
api.use(replies);
api.use(shares);
api.use(shareCategories);
api.use(tags);

router.use('/api', api.routes());

module.exports = router.routes();
