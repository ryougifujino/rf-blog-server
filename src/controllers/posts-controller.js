const {Post} = require('../data');

const get = async ctx => {
    const {offset, limit} = ctx.query;
    let posts = await Post.limit(limit, offset).order('created_on', true);
    console.log(posts);
    ctx.response.body = posts;
};

const post = async ctx => {
    const {title, body, is_private, album_id} = ctx.request.body;
    console.log(typeof is_private);
    let post = await Post.create({
        title,
        body,
        is_private: is_private === "1",
        album_id,
    });
    console.log(post);
};

module.exports = {
    get,
    post
};