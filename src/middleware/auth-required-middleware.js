module.exports = (ctx, next) => {
    const token = ctx.cookies.get("token");
    if (token && token === ctx.state.token) {
        return next();
    }
    ctx.status = 401;
};
