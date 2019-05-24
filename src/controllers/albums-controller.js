const {Album} = require('../data');
const {Pagination} = require('../data/body-templates');
const DateUtils = require('../lib/date-utils');
const {buildSchema, validate} = require('../lib/joi-helper');

const NAME_LENGTH_LIMIT = 200;
const schema = buildSchema(Joi => ({
    name: Joi.string().trim().required().min(1).max(NAME_LENGTH_LIMIT)
}));

const post = async ctx => {
    let {album: {name} = {}} = ctx.request.body;
    if (!validate(ctx, schema, {name})) {
        return;
    }
    name = name.trim();
    if ((await Album.where({name})).length) {
        ctx.status = 409;
        ctx.body = ['name already exists'];
        return;
    }
    const album = await Album.create({
        name,
        created_on: DateUtils.nowUtcDateTimeString()
    });
    ctx.status = 201;
    ctx.body = album;
};

const del = async ctx => {
    const albumId = ctx.params.id;
    const album = await Album.find(albumId);
    album && album.destroy();
    ctx.status = 204;
};

const patch = async ctx => {
    const albumId = ctx.params.id;
    let {album: {name} = {}} = ctx.request.body;
    if (!validate(ctx, schema, {name})) {
        return;
    }
    const album = await Album.find(albumId);
    if (!album) {
        ctx.status = 400;
        ctx.body = ["invalid album id"];
        return;
    }
    await album.update({name});
    ctx.status = 204;
};

const get = async ctx => {
    const {offset, limit} = ctx.query;
    const albums = await Album.limit(limit, offset).order('created_on', true);
    ctx.body = new Pagination(albums.length, albums);
};

const getOne = async ctx => {
    const albumId = ctx.params.id;
    const album = await Album.find(albumId);
    if (album) {
        ctx.body = album;
    } else {
        ctx.status = 404;
    }
};

module.exports = {
    post,
    del,
    patch,
    get,
    getOne
};
