const Router = require('koa-router');
const ctrl = require('../controllers').replies;
const router = new Router();

const auth = require('../middleware/auth-required-middleware');

router.post('/replies', ctrl.post);
router.delete('/replies/:id', auth, ctrl.del);
router.get('/replies', ctrl.get);

module.exports = router.routes();
