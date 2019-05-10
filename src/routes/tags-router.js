const Router = require('koa-router');
const ctrl = require('../controllers').tags;
const router = new Router();

const auth = require('../middleware/auth-required-middleware');

router.post('/tags', auth, ctrl.post);
router.delete('/tags/:id', auth, ctrl.del);
router.patch('/tags/:id', auth, ctrl.patch);
router.get('/tags', ctrl.get);

module.exports = router.routes();
