module.exports = async (ctx, next) => {
    try {
        await next();
    } catch (e) {
        ctx.response.status = e.statusCode || e.status || 500;
        ctx.response.body = [e.message];
        console.error("Unhandled error: ", e);
    }
};
