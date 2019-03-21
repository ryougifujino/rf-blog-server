const Router = require('koa-router');
const ctrl = require('../controllers').posts;
const router = new Router();

router.get('/posts', ctrl.get);
router.post('/posts', ctrl.post);

module.exports = router.routes();