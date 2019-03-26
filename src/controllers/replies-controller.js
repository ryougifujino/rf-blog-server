const {Reply, Comment} = require('../data');
const {ErrorMessages, Pagination} = require('../data/body-templates');
const DateUtils = require('../lib/date-utils');

const REPLY_LENGTH_LIMIT = 1000;
const FROM_USER_LENGTH_LIMIT = 20;

const post = async ctx => {
    const {reply: {content, from_user, comment_id} = {}} = ctx.request.body;
    if (content && content.length > REPLY_LENGTH_LIMIT) {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", ['content length exceeds limitation']);
        return;
    }
    if (from_user && from_user.length > FROM_USER_LENGTH_LIMIT) {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", ['from user length exceeds limitation']);
        return;
    }
    const comment = await Comment.find(comment_id);
    if (!comment) {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", ['comment id does not exist']);
        return;
    }
    try {
        const reply = await Reply.create({
            content,
            from_user,
            comment_id,
            created_on: DateUtils.nowUtcDateTimeString()
        });
        ctx.status = 201;
        ctx.body = reply;
    } catch (e) {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", e.toString().split('\n'));
    }
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