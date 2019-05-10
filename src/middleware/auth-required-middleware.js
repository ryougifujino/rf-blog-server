const {COOKIE_NAME_TOKEN} = require('../common/constants');
const memoryCache = require('../lib/memory-cache');

module.exports = (ctx, next) => {
    const token = ctx.cookies.get(COOKIE_NAME_TOKEN);
    if (token && token === memoryCache.getItem(COOKIE_NAME_TOKEN)) {
        return next();
    }
    ctx.status = 401;
};
