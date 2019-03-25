const Router = require('koa-router');
const ctrl = require('../controllers').comments;
const router = new Router();

router.post('/comments', ctrl.post);
router.delete('/comments/:id', ctrl.del);
router.get('/comments', ctrl.get);

module.exports = router.routes();