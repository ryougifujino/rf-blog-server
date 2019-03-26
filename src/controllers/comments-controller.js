const {Post, Comment} = require('../data');
const {ErrorMessages, Pagination} = require('../data/body-templates');
const DateUtils = require('../lib/date-utils');

const CONTENT_LENGTH_LIMIT = 5000;
const FROM_USER_LENGTH_LIMIT = 20;

const post = async ctx => {
    const {comment: {content, from_user, post_id} = {}} = ctx.request.body;
    if (content && content.length > CONTENT_LENGTH_LIMIT) {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", ['content length exceeds limitation']);
        return;
    }
    if (from_user && from_user.length > FROM_USER_LENGTH_LIMIT) {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", ['from user length exceeds limitation']);
        return;
    }
    const post = await Post.find(post_id);
    if (!post) {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", ['post id does not exist']);
        return;
    }
    try {
        const comment = await Comment.create({
            content,
            from_user,
            post_id,
            created_on: DateUtils.nowUtcDateTimeString()
        });
        ctx.status = 201;
        ctx.body = comment;
    } catch (e) {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", e.toString().split('\n'));
    }
};

const del = async ctx => {
    const commentId = ctx.params.id;
    const comment = await Comment.find(commentId);
    comment && comment.destroy();
    ctx.status = 204;
};

const get = async ctx => {
    const {limit, offset} = ctx.query;
    const comments = await Comment.limit(limit, offset).order('created_on', true);
    ctx.body = new Pagination(comments.length, comments);
};

module.exports = {
    post,
    del,
    get
};