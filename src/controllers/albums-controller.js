const {Album} = require('../data');
const {ErrorMessages, Pagination} = require('../data/body-templates');
const DateUtils = require('../lib/date-utils');

const post = async ctx => {
    const {album: {name} = {}} = ctx.request.body;
    try {
        const album = await Album.create({
            name,
            created_on: DateUtils.nowUtcDateTimeString()
        });
        ctx.status = 201;
        ctx.body = album;
    } catch (e) {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", e.toString().split('\n'));
    }
};

const del = async ctx => {
    const albumId = ctx.params.id;
    const album = await Album.find(albumId);
    album && album.destroy();
    ctx.status = 204;
};

const patch = async ctx => {
    const albumId = ctx.params.id;
    try {
        const {album: {name} = {}} = ctx.request.body;
        const album = await Album.find(albumId);
        if (!album) {
            ctx.status = 400;
            ctx.body = new ErrorMessages("params error", ["invalid album id"]);
            return;
        }
        await album.update({
            name
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