const Router = require('koa-router');
const ctrl = require('../controllers').shares;
const router = new Router();

const auth = require('../middleware/auth-required-middleware');

router.post('/shares', auth, ctrl.post);
router.delete('/shares/:id', auth, ctrl.del);
router.patch('/shares/:id', auth, ctrl.patch);
router.get('/shares', ctrl.get);

module.exports = router.routes();
