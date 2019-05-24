const {Album, Post, PostTag, Tag} = require('../data');
const {Pagination} = require('../data/body-templates');
const DateUtils = require('../lib/date-utils');
const SetUtils = require('../lib/set-utils');
const md5 = require('md5');
const {COOKIE_NAME_TOKEN} = require('../common/constants');
const memoryCache = require('../lib/memory-cache');

const PREVIEW_LENGTH_LIMIT = 500;
const TITLE_LENGTH_LIMIT = 200;
const TAG_NAME_LENGTH_LIMIT = 20;
const RE_TITLES = /^\/[a-z\/]+?titles/;

const get = async ctx => {
    const isTitles = RE_TITLES.test(ctx.url);
    const {offset, limit} = ctx.query;
    const token = ctx.cookies.get(COOKIE_NAME_TOKEN);
    let posts;
    if (token && token === memoryCache.getItem(COOKIE_NAME_TOKEN)) {
        posts = (await Post.limit(limit, offset).include('tags').order('created_on', true)).toJson();
    } else {
        posts = (await Post.where({is_private: false}).include('tags')
            .order('created_on', true).limit(limit, offset)).toJson();
    }
    posts.forEach(post => {
        if (isTitles) {
            delete post.body;
        } else {
            post.body = post.body.substr(0, PREVIEW_LENGTH_LIMIT);
        }
        delete post.post_tags;
    });
    ctx.body = new Pagination(posts.length, posts);
};

const getOne = async ctx => {
    const postId = ctx.params.id;
    let post = await Post.find(postId).include(['tags', 'album']);
    if (post) {
        if (post.is_private) {
            const token = ctx.cookies.get(COOKIE_NAME_TOKEN);
            if (!token || token !== memoryCache.getItem(COOKIE_NAME_TOKEN)) {
                ctx.status = 401;
                return;
            }
        }
        post = post.toJson();
        delete post.post_tags;
        post.album = post.album ? post.album : null;

        const etag = md5(JSON.stringify(post));
        if (ctx.headers['if-none-match'] === etag) {
            ctx.status = 304;
        } else {
            ctx.set('ETag', etag);
            ctx.body = post;
        }
    } else {
        ctx.status = 404;
    }
};

async function createTagsNotExist(tagNames) {
    const tagsExisting = await Tag.where({name: tagNames});
    const tagNamesNew = [...SetUtils.difference(tagNames, tagsExisting.map(t => t.name))];
    const tagsNew = await Tag.create(tagNamesNew.map(
        name => ({name, created_on: DateUtils.nowUtcDateTimeString()})
    ));
    return [...tagsExisting, ...tagsNew];
}

function justifyTagNames(tagNames) {
    if (!Array.isArray(tagNames)) {
        return [];
    }
    return [...new Set(tagNames)]
        .filter(tag_name => typeof tag_name === 'string')
        .map(tag_name => tag_name.trim())
        .filter(tag_name => tag_name && tag_name.length <= TAG_NAME_LENGTH_LIMIT);
}

const post = async ctx => {
    let {post: {title, body = "", is_private, album_id, tag_names} = {}} = ctx.request.body;
    const titleIsString = typeof title === 'string';
    const bodyIsString = typeof body === 'string';
    if (!titleIsString || !bodyIsString) {
        ctx.status = 400;
        const errors = [];
        !titleIsString && errors.push('wrong type of title');
        !bodyIsString && errors.push('wrong type of body');
        ctx.body = errors;
        return;
    }
    title = title.trim();
    if (!title || title.length > TITLE_LENGTH_LIMIT) {
        ctx.status = 400;
        ctx.body = ['wrong length of title'];
        return;
    }
    const albumExisting = await Album.find(album_id);
    const albumId = albumExisting ? albumExisting.id : undefined;
    try {
        const post = (await Post.create({
            title,
            body,
            is_private,
            album_id: albumId,
            created_on: DateUtils.nowUtcDateTimeString()
        })).toJson();
        const tagNames = justifyTagNames(tag_names);
        post.tags = [];
        if (tagNames.length > 0) {
            const tagsOfThePost = await createTagsNotExist(tagNames);
            const tagIdsToSave = tagsOfThePost.map(tag => tag.id);

            // // get all tags of this post (should be empty, because the post is a new one)
            // const postTags = await PostTag.where({post_id: post.id}).include('tags');
            // // filter all existed tag ids to get `tagIdsToSave`
            // const postTagIds = {};
            // postTags.forEach(postTag => (postTagIds[postTag.id] = true));
            // const tagIdsToSave = tag_ids.filter(tag_id => !postTagIds[tag_id]);

            const postTagsToSave = tagIdsToSave.map(tagId => ({post_id: post.id, tag_id: tagId}));
            await PostTag.create(postTagsToSave);
            post.tags = tagsOfThePost;
        }
        post.body = post.body.substr(0, PREVIEW_LENGTH_LIMIT);
        ctx.status = 201;
        ctx.body = post;
    } catch (e) {
        ctx.status = 400;
        ctx.body = e.toString().split('\n');
    }
};

const patch = async ctx => {
    const postId = ctx.params.id;
    let {post: {title, body, is_private, album_id, tag_names} = {}} = ctx.request.body;

    if (typeof title === 'string') {
        title = title.trim();
        if (title.length === 0 || title.length > TITLE_LENGTH_LIMIT) {
            ctx.status = 400;
            ctx.body = ['wrong length of title'];
            return;
        }
    } else if (typeof title !== 'undefined') {
        ctx.status = 400;
        ctx.body = ['wrong type of title'];
        return;
    }
    const post = await Post.find(postId);
    if (!post) {
        ctx.status = 400;
        ctx.body = ["invalid post id"];
        return;
    }
    const album = await Album.find(album_id);
    const albumId = album ? album.id : undefined;
    try {
        await post.update({
            title,
            body,
            is_private,
            album_id: albumId
        });
        if (Array.isArray(tag_names)) {
            const tagNames = justifyTagNames(tag_names);
            const validTagIds = (await createTagsNotExist(tagNames)).map(tag => tag.id);
            const tagsOfThePost = await PostTag.where({post_id: postId}).include('tags');
            const tagIdsOfThePost = tagsOfThePost.map(postTag => postTag.tag_id);
            const tagToDeleteIds = [...SetUtils.difference(tagIdsOfThePost, validTagIds)];
            const tagToAddIds = [...SetUtils.difference(validTagIds, tagIdsOfThePost)];
            tagToDeleteIds.length > 0 && await PostTag.where({
                post_id: postId,
                tag_id: tagToDeleteIds
            }).destroyAll();
            const tagsToAdd = tagToAddIds.map(id => ({post_id: postId, tag_id: id}));
            tagsToAdd.length > 0 && await PostTag.create(tagsToAdd);
        }
        ctx.status = 204;
    } catch (e) {
        console.error(e);
        ctx.status = 400;
        ctx.body = e.toString().split('\n');
    }
};

const del = async ctx => {
    const postId = ctx.params.id;
    const post = await Post.find(postId);
    post && post.destroy();
    ctx.status = 204;
};

module.exports = {
    get,
    getOne,
    post,
    patch,
    del
};
