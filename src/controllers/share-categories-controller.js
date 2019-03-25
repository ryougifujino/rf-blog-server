const {ShareCategory} = require('../data');
const {ErrorMessages, Pagination} = require('../data/body-templates');
const DateUtils = require('../lib/date-utils');

const NAME_LENGTH_LIMIT = 100;

const post = async ctx => {
    const {share_category: {name} = {}} = ctx.request.body;
    if (name && name.length > NAME_LENGTH_LIMIT) {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", ['name length exceeds limitation']);
        return;
    }
    try {
        const shareCategory = await ShareCategory.create({
            name,
            created_on: DateUtils.nowUtcDateTimeString()
        });
        ctx.status = 201;
        ctx.body = shareCategory;
    } catch (e) {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", e.toString().split('\n'));
    }
};

const del = async ctx => {
    const shareCategoryId = ctx.params.id;
    const shareCategory = await ShareCategory.find(shareCategoryId);
    shareCategory && shareCategory.destroy();
    ctx.status = 204;
};

const patch = async ctx => {
    const shareCategoryId = ctx.params.id;
    const {share_category: {name} = {}} = ctx.request.body;
    if (name && name.length > NAME_LENGTH_LIMIT) {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", ['name length exceeds limitation']);
        return;
    }
    const shareCategory = await ShareCategory.find(shareCategoryId);
    if (!shareCategory) {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", ["invalid share category id"]);
        return;
    }
    try {
        await shareCategory.update({name});
        ctx.status = 204;
    } catch (e) {
        console.error(e);
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", e.toString().split('\n'));
    }
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