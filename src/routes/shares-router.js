const Router = require('koa-router');
const ctrl = require('../controllers').shares;
const router = new Router();

router.post('/shares', ctrl.post);
router.delete('/shares/:id', ctrl.del);
router.patch('/shares/:id', ctrl.patch);
router.get('/shares', ctrl.get);

module.exports = router.routes();