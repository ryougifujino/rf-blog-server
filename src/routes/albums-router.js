const Router = require('koa-router');
const ctrl = require('../controllers').albums;
const router = new Router();

const auth = require('../middleware/auth-required-middleware');

router.post('/albums', auth, ctrl.post);
router.delete('/albums/:id', auth, ctrl.del);
router.patch('/albums/:id', auth, ctrl.patch);
router.get('/albums', ctrl.get);
router.get('/albums/:id', ctrl.getOne);

module.exports = router.routes();
