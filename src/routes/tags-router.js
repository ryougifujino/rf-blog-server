const Router = require('koa-router');
const ctrl = require('../controllers').tags;
const router = new Router();

router.post('/tags', ctrl.post);
router.delete('/tags/:id', ctrl.del);
router.patch('/tags/:id', ctrl.patch);
router.get('/tags', ctrl.get);

module.exports = router.routes();