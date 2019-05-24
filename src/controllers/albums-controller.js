const {Album} = require('../data');
const {Pagination} = require('../data/body-templates');
const DateUtils = require('../lib/date-utils');
const Joi = require('@hapi/joi');

const NAME_LENGTH_LIMIT = 200;

const post = async ctx => {
    let {album: {name} = {}} = ctx.request.body;
    const schema = Joi.object().keys({
        name: Joi.string().trim().required().min(1).max(NAME_LENGTH_LIMIT)
    });
    const {error} = Joi.validate({name}, schema);
    if (error) {
        ctx.status = 400;
        ctx.body = error.details.map(({message}) => message);
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
    if (typeof name !== 'string') {
        ctx.status = 400;
        ctx.body = ['wrong type of name'];
        return;
    }
    name = name.trim();
    if (!name || name.length > NAME_LENGTH_LIMIT) {
        ctx.status = 400;
        ctx.body = ['wrong length of name'];
        return;
    }
    const album = await Album.find(albumId);
    if (!album) {
        ctx.status = 400;
        ctx.body = ["invalid album id"];
        return;
    }
    try {
        await album.update({name});
        ctx.status = 204;
    } catch (e) {
        console.error(e);
        ctx.status = 400;
        ctx.body = e.toString().split('\n');
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
