const {Share, ShareCategory} = require('../data');
const {Pagination} = require('../data/body-templates');
const DateUtils = require('../lib/date-utils');
const {buildSchema, validate, Joi} = require('../lib/joi-helper');

const TITLE_LENGTH_LIMIT = 200;

const post = async ctx => {
    let {share: {title, url, share_category_id} = {}} = ctx.request.body;
    const schema = buildSchema({
        title: Joi.string().trim().min(1).max(TITLE_LENGTH_LIMIT).required()
    });
    if (!validate(ctx, schema, {title})) {
        return;
    }
    title = title.trim();
    let shareCategoryId = undefined;
    if (share_category_id) {
        const shareCategory = await ShareCategory.find(share_category_id);
        shareCategoryId = shareCategory ? share_category_id : undefined;
    }
    const share = await Share.create({
        title,
        url,
        share_category_id: shareCategoryId,
        created_on: DateUtils.nowUtcDateTimeString()
    });
    ctx.status = 201;
    ctx.body = share;
};

const del = async ctx => {
    const shareId = ctx.params.id;
    const share = await Share.find(shareId);
    share && share.destroy();
    ctx.status = 204;
};

const patch = async ctx => {
    const shareId = ctx.params.id;
    let {share: {title, url, share_category_id} = {}} = ctx.request.body;
    const schema = buildSchema({
        title: Joi.string().trim().min(1).max(TITLE_LENGTH_LIMIT)
    });
    if (!validate(ctx, schema, {title})) {
        return;
    }
    title = title && title.trim();
    const share = await Share.find(shareId);
    if (!share) {
        ctx.status = 400;
        ctx.body = ["invalid share id"];
        return;
    }
    let shareCategoryId = undefined;
    if (share_category_id) {
        const shareCategory = await ShareCategory.find(share_category_id);
        shareCategoryId = shareCategory ? share_category_id : undefined;
    }
    await share.update({
        title,
        url,
        share_category_id: shareCategoryId
    });
    ctx.status = 204;
};

const get = async ctx => {
    const {offset, limit} = ctx.query;
    const shares = (await Share.limit(limit, offset).order('created_on', true));
    ctx.body = new Pagination(shares.length, shares);
};

module.exports = {
    post,
    del,
    patch,
    get
};
