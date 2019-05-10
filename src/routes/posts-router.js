const Router = require('koa-router');
const ctrl = require('../controllers').posts;
const router = new Router();

const auth = require('../middleware/auth-required-middleware');

router.get('/posts/titles', ctrl.get);
router.get('/posts', ctrl.get);
router.get('/posts/:id', ctrl.getOne);
router.post('/posts', auth, ctrl.post);
router.patch('/posts/:id', auth, ctrl.patch);
router.delete('/posts/:id', auth, ctrl.del);

module.exports = router.routes();
