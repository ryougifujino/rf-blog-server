const memoryCache = require('../lib/memory-cache');
const {COOKIE_NAME_TOKEN} = require('../common/constants');
const md5 = require('md5');

function clear() {
    memoryCache.setItem(COOKIE_NAME_TOKEN, '');
}

function isAuthenticated(ctx) {
    const token = ctx.cookies.get(COOKIE_NAME_TOKEN);
    return token && token === memoryCache.getItem(COOKIE_NAME_TOKEN);
}

function setAuth(ctx, credential) {
    const token = md5(credential + new Date().getTime());
    ctx.cookies.set(COOKIE_NAME_TOKEN, token);
    memoryCache.setItem(COOKIE_NAME_TOKEN, token);
}

module.exports = {
    clear,
    isAuthenticated,
    setAuth
};
