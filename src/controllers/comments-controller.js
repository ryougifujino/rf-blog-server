const {Post, Comment} = require('../data');
const {Pagination} = require('../data/body-templates');
const DateUtils = require('../lib/date-utils');

const CONTENT_LENGTH_LIMIT = 5000;
const FROM_USER_LENGTH_LIMIT = 20;

const post = async ctx => {
    let {comment: {content, from_user, post_id} = {}} = ctx.request.body;
    const contentIsString = typeof content === 'string';
    const fromUserIsString = typeof from_user === 'string';
    if (!contentIsString || !fromUserIsString) {
        ctx.status = 400;
        const errors = [];
        !contentIsString && errors.push('wrong type of content');
        !fromUserIsString && errors.push('wrong type of from_user');
        ctx.body = errors;
        return;
    }
    content = content.trim();
    from_user = from_user.trim();
    if (!content || content.length > CONTENT_LENGTH_LIMIT) {
        ctx.status = 400;
        ctx.body = ['wrong length of content'];
        return;
    }
    if (!from_user || from_user.length > FROM_USER_LENGTH_LIMIT) {
        ctx.status = 400;
        ctx.body = ['wrong length of from_user'];
        return;
    }
    const post = await Post.find(post_id);
    if (!post) {
        ctx.status = 400;
        ctx.body = ['post id does not exist'];
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
        ctx.body = e.toString().split('\n');
    }
};

const del = async ctx => {
    const commentId = ctx.params.id;
    const comment = await Comment.find(commentId);
    comment && comment.destroy();
    ctx.status = 204;
};

const get = async ctx => {
    const postId = ctx.params.id;
    const {limit, offset} = ctx.query;
    const comments = await Comment.where({post_id: postId})
        .include('replies').limit(limit, offset).order('created_on', true);
    ctx.body = new Pagination(comments.length, comments);
};

module.exports = {
    post,
    del,
    get
};
