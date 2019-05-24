const {Post, Comment} = require('../data');
const {Pagination} = require('../data/body-templates');
const DateUtils = require('../lib/date-utils');
const {buildSchema, validate, Joi} = require('../lib/joi-helper');

const CONTENT_LENGTH_LIMIT = 5000;
const FROM_USER_LENGTH_LIMIT = 20;

const post = async ctx => {
    let {comment: {content, from_user, post_id} = {}} = ctx.request.body;
    const schema = buildSchema({
        content: Joi.string().trim().min(1).max(CONTENT_LENGTH_LIMIT).required(),
        from_user: Joi.string().trim().min(1).max(FROM_USER_LENGTH_LIMIT).required(),
        post_id: Joi.number().integer().required()
    });
    if (!validate(ctx, schema, {content, from_user, post_id})) {
        return;
    }
    content = content.trim();
    from_user = from_user.trim();
    const post = await Post.find(post_id);
    if (!post) {
        ctx.status = 400;
        ctx.body = ['post id does not exist'];
        return;
    }
    const comment = await Comment.create({
        content,
        from_user,
        post_id,
        created_on: DateUtils.nowUtcDateTimeString()
    });
    ctx.status = 201;
    ctx.body = comment;
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
