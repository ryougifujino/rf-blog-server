const Router = require('koa-router');
const ctrl = require('../controllers').posts;
const router = new Router();

router.get('/posts', ctrl.get);
router.post('/posts', ctrl.post);
router.patch('/posts/:id', ctrl.patch);

module.exports = router.routes();