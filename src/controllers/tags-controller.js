const {Tag} = require('../data');
const {Pagination} = require('../data/body-templates');
const DateUtils = require('../lib/date-utils');
const {buildSchema, validate, Joi} = require('../lib/joi-helper');

const NAME_LENGTH_LIMIT = 20;

const post = async ctx => {
    let {tag: {name} = {}} = ctx.request.body;
    const schema = buildSchema({
        name: Joi.string().trim().min(1).max(NAME_LENGTH_LIMIT).required()
    });
    if (!validate(ctx, schema, {name})) {
        return;
    }
    name = name.trim();
    if ((await Tag.where({name})).length) {
        ctx.status = 409;
        ctx.body = ['name already exists'];
        return;
    }
    const tag = await Tag.create({
        name,
        created_on: DateUtils.nowUtcDateTimeString()
    });
    ctx.status = 201;
    ctx.body = tag;
};

const del = async ctx => {
    const tagId = ctx.params.id;
    const tag = await Tag.find(tagId);
    tag && tag.destroy();
    ctx.status = 204;
};

const patch = async ctx => {
    const tagId = ctx.params.id;
    let {tag: {name} = {}} = ctx.request.body;
    const schema = buildSchema({
        name: Joi.string().trim().min(1).max(NAME_LENGTH_LIMIT)
    });
    if (!validate(ctx, schema, {name})) {
        return;
    }
    name = name && name.trim();
    const tag = await Tag.find(tagId);
    if (!tag) {
        ctx.status = 400;
        ctx.body = ["invalid tag id"];
        return;
    }
    if ((await Tag.where({name})).length) {
        ctx.status = 409;
        ctx.body = ['name already exists'];
        return;
    }
    await tag.update({name});
    ctx.status = 204;
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
