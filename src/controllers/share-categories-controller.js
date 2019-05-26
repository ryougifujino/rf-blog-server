const {ShareCategory} = require('../data');
const {Pagination} = require('../data/body-templates');
const DateUtils = require('../lib/date-utils');
const {buildSchema, validate, Joi} = require('../lib/joi-helper');

const NAME_LENGTH_LIMIT = 100;

const post = async ctx => {
    let {share_category: {name} = {}} = ctx.request.body;
    const schema = buildSchema({
        name: Joi.string().trim().min(1).max(NAME_LENGTH_LIMIT).required()
    });
    if (!validate(ctx, schema, {name})) {
        return;
    }
    name = name.trim();
    if ((await ShareCategory.where({name})).length) {
        ctx.status = 409;
        ctx.body = ['name already exists'];
        return;
    }
    const shareCategory = await ShareCategory.create({
        name,
        created_on: DateUtils.nowUtcDateTimeString()
    });
    ctx.status = 201;
    ctx.body = shareCategory;
};

const del = async ctx => {
    const shareCategoryId = ctx.params.id;
    const shareCategory = await ShareCategory.find(shareCategoryId);
    shareCategory && shareCategory.destroy();
    ctx.status = 204;
};

const patch = async ctx => {
    const shareCategoryId = ctx.params.id;
    let {share_category: {name} = {}} = ctx.request.body;
    const schema = buildSchema({
        name: Joi.string().trim().min(1).max(NAME_LENGTH_LIMIT)
    });
    if (!validate(ctx, schema, {name})) {
        return;
    }
    name = name && name.trim();
    if ((await ShareCategory.where({name})).length) {
        ctx.status = 409;
        ctx.body = ['name already exists'];
        return;
    }
    const shareCategory = await ShareCategory.find(shareCategoryId);
    if (!shareCategory) {
        ctx.status = 400;
        ctx.body = ["invalid share category id"];
        return;
    }
    await shareCategory.update({name});
    ctx.status = 204;
};

const get = async ctx => {
    const {offset, limit} = ctx.query;
    const shareCategories = (await ShareCategory.limit(limit, offset).order('created_on', true));
    ctx.body = new Pagination(shareCategories.length, shareCategories);
};

module.exports = {
    post,
    del,
    patch,
    get
};
