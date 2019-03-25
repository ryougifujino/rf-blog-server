const Router = require('koa-router');
const ctrl = require('../controllers').posts;
const router = new Router();

router.get('/posts', ctrl.get);
router.get('/posts/:id', ctrl.getOne);
router.post('/posts', ctrl.post);
router.patch('/posts/:id', ctrl.patch);
router.delete('/posts/:id', ctrl.del);

module.exports = router.routes();