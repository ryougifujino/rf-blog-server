const Router = require('koa-router');
const ctrl = require('../controllers').token;
const router = new Router();

const auth = require('../middleware/auth-required-middleware');

router.post('/token', ctrl.post);
router.delete('/token', auth, ctrl.del);
router.get('/token', auth, ctrl.getOne);

module.exports = router.routes();
