const Router = require('koa-router');
const ctrl = require('../controllers').replies;
const router = new Router();

router.post('/replies', ctrl.post);
router.delete('/replies/:id', ctrl.del);
router.get('/replies', ctrl.get);

module.exports = router.routes();