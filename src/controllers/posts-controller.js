const get = ctx => {
    ctx.response.body = [
        {
            title: "Clean Architecture",
            preview: "Clean Architecture: A Craftsman's Guide to Software Structure and Design (Robert C. Martin Series)",
        }
    ];
};

module.exports = {
    get
};