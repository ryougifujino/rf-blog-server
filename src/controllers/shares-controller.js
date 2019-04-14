const {Share, ShareCategory} = require('../data');
const {ErrorMessages, Pagination} = require('../data/body-templates');
const DateUtils = require('../lib/date-utils');

const TITLE_LENGTH_LIMIT = 200;

const post = async ctx => {
    let {share: {title, url, share_category_id} = {}} = ctx.request.body;

    if (typeof title !== 'string') {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", ['wrong type of title']);
        return;
    }
    title = title.trim();
    if (!title || title.length > TITLE_LENGTH_LIMIT) {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", ['wrong length of title']);
        return;
    }
    try {
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
    } catch (e) {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", e.toString().split('\n'));
    }
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

    if (typeof title !== 'string') {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", ['wrong type of title']);
        return;
    }
    title = title.trim();
    if (!title || title.length > TITLE_LENGTH_LIMIT) {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", ['wrong length of title']);
        return;
    }
    const share = await Share.find(shareId);
    if (!share) {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", ["invalid share id"]);
        return;
    }
    let shareCategoryId = undefined;
    if (share_category_id) {
        const shareCategory = await ShareCategory.find(share_category_id);
        shareCategoryId = shareCategory ? share_category_id : undefined;
    }
    try {
        await share.update({
            title,
            url,
            share_category_id: shareCategoryId
        });
        ctx.status = 204;
    } catch (e) {
        console.error(e);
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", e.toString().split('\n'));
    }

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