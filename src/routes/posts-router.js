const Router = require('koa-router');
const ctrl = require('../controllers').posts;
const router = new Router();

router.get('/posts', ctrl.get);

module.exports = router.routes();