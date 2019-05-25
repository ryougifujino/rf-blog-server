const {Reply, Comment} = require('../data');
const {Pagination} = require('../data/body-templates');
const DateUtils = require('../lib/date-utils');
const {buildSchema, validate, Joi} = require('../lib/joi-helper');

const REPLY_LENGTH_LIMIT = 1000;
const FROM_USER_LENGTH_LIMIT = 20;

const post = async ctx => {
    let {reply: {content, from_user, comment_id} = {}} = ctx.request.body;
    const schema = buildSchema({
        content: Joi.string().trim().min(1).max(REPLY_LENGTH_LIMIT).required(),
        from_user: Joi.string().trim().min(1).max(FROM_USER_LENGTH_LIMIT).required()
    });
    if (!validate(ctx, schema, {content, from_user})) {
        return;
    }
    content = content.trim();
    from_user = from_user.trim();
    const comment = await Comment.find(comment_id);
    if (!comment) {
        ctx.status = 400;
        ctx.body = ['invalid comment id'];
        return;
    }
    const reply = await Reply.create({
        content,
        from_user,
        comment_id,
        created_on: DateUtils.nowUtcDateTimeString()
    });
    ctx.status = 201;
    ctx.body = reply;
};

const del = async ctx => {
    const replyId = ctx.params.id;
    const reply = await Reply.find(replyId);
    reply && reply.destroy();
    ctx.status = 204;
};

const get = async ctx => {
    const {limit, offset} = ctx.query;
    const replies = await Reply.limit(limit, offset).order('created_on', true);
    ctx.body = new Pagination(replies.length, replies);
};

module.exports = {
    post,
    del,
    get
};
