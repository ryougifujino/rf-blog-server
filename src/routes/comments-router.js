const Router = require('koa-router');
const ctrl = require('../controllers').comments;
const router = new Router();

const auth = require('../middleware/auth-required-middleware');

router.post('/comments', ctrl.post);
router.delete('/comments/:id', auth, ctrl.del);
router.get('/comments/:id', ctrl.get);

module.exports = router.routes();
