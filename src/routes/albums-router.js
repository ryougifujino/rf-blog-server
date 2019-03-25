const Router = require('koa-router');
const ctrl = require('../controllers').albums;
const router = new Router();

router.post('/albums', ctrl.post);
router.delete('/albums/:id', ctrl.del);
router.patch('/albums/:id', ctrl.patch);
router.get('/albums', ctrl.get);
router.get('/albums/:id', ctrl.getOne);

module.exports = router.routes();