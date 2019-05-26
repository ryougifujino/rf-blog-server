const AuthManager = require('../lib/auth-manager');

module.exports = (ctx, next) => {
    if (AuthManager.isAuthenticated(ctx)) {
        return next();
    }
    ctx.status = 401;
};
