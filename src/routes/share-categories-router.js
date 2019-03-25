const Router = require('koa-router');
const ctrl = require('../controllers').shareCategories;
const router = new Router();

router.post('/share-categories', ctrl.post);
router.delete('/share-categories/:id', ctrl.del);
router.patch('/share-categories/:id', ctrl.patch);
router.get('/share-categories', ctrl.get);

module.exports = router.routes();