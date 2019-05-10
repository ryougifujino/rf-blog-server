const Router = require('koa-router');
const ctrl = require('../controllers').shareCategories;
const router = new Router();

const auth = require('../middleware/auth-required-middleware');

router.post('/share-categories', auth, ctrl.post);
router.delete('/share-categories/:id', auth, ctrl.del);
router.patch('/share-categories/:id', auth, ctrl.patch);
router.get('/share-categories', ctrl.get);

module.exports = router.routes();
