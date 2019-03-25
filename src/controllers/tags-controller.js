const {Tag} = require('../data');
const {ErrorMessages, Pagination} = require('../data/body-templates');
const DateUtils = require('../lib/date-utils');

const NAME_LENGTH_LIMIT = 20;

const post = async ctx => {
    const {tag: {name} = {}} = ctx.request.body;
    if (name && name.length > NAME_LENGTH_LIMIT) {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", ['name length exceeds limitation'])
        return;
    }
    try {
        const tag = await Tag.create({
            name,
            created_on: DateUtils.nowUtcDateTimeString()
        });
        ctx.status = 201;
        ctx.body = tag;
    } catch (e) {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", e.toString().split('\n'));
    }
};

const del = async ctx => {
    const tagId = ctx.params.id;
    const tag = await Tag.find(tagId);
    tag && tag.destroy();
    ctx.status = 204;
};

const patch = async ctx => {
    const tagId = ctx.params.id;
    const {tag: {name} = {}} = ctx.request.body;
    if (name && name.length > NAME_LENGTH_LIMIT) {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", ['name length exceeds limitation'])
        return;
    }
    const tag = await Tag.find(tagId);
    if (!tag) {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", ["invalid tag id"]);
        return;
    }
    try {
        await tag.update({
            name
        });
        ctx.status = 204;
    } catch (e) {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", e.toString().split('\n'));
    }
};

const get = async ctx => {
    const {limit, offset} = ctx.query;
    const tags = await Tag.limit(limit, offset).order('created_on', true);
    ctx.body = new Pagination(tags.length, tags);
};

module.exports = {
    post,
    del,
    patch,
    get
};