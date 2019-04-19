const {Album, Post, PostTag, Tag} = require('../data');
const {ErrorMessages, Pagination} = require('../data/body-templates');
const DateUtils = require('../lib/date-utils');
const SetUtils = require('../lib/set-utils');

const PREVIEW_LENGTH_LIMIT = 500;
const TITLE_LENGTH_LIMIT = 200;
const TAG_NAME_LENGTH_LIMIT = 20;
const RE_TITLES = /^\/[a-z\/]+?titles/;

const get = async ctx => {
    const isTitles = RE_TITLES.test(ctx.url);
    const {offset, limit} = ctx.query;
    const posts = (await Post.limit(limit, offset).include('tags').order('created_on', true)).toJson();
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
    const post = await Post.find(postId);
    if (post) {
        ctx.body = post;
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
    return [...tagsExisting.map(t => t.id), ...tagsNew.map(t => t.id)];
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
        ctx.body = new ErrorMessages("params error", errors);
        return;
    }
    title = title.trim();
    if (!title || title.length > TITLE_LENGTH_LIMIT) {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", ['wrong length of title']);
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
        if (tagNames.length > 0) {
            const tagIdsToSave = await createTagsNotExist(tagNames);

            // // get all tags of this post (should be empty, because the post is a new one)
            // const postTags = await PostTag.where({post_id: post.id}).include('tags');
            // // filter all existed tag ids to get `tagIdsToSave`
            // const postTagIds = {};
            // postTags.forEach(postTag => (postTagIds[postTag.id] = true));
            // const tagIdsToSave = tag_ids.filter(tag_id => !postTagIds[tag_id]);

            const postTagsToSave = tagIdsToSave.map(tagId => ({post_id: post.id, tag_id: tagId}));
            await PostTag.create(postTagsToSave);
            post.tag_names = tagNames;
        }
        ctx.status = 201;
        ctx.body = post;
    } catch (e) {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", e.toString().split('\n'));
    }
};

const patch = async ctx => {
    const postId = ctx.params.id;
    let {post: {title, body, is_private, album_id, tag_names} = {}} = ctx.request.body;

    if (typeof title === 'string') {
        title = title.trim();
        if (title.length === 0 || title.length > TITLE_LENGTH_LIMIT) {
            ctx.status = 400;
            ctx.body = new ErrorMessages("params error", ['wrong length of title']);
            return;
        }
    } else if (typeof title !== 'undefined') {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", ['wrong type of title']);
        return;
    }
    const post = await Post.find(postId);
    if (!post) {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", ["invalid post id"]);
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
            const validTagIds = await createTagsNotExist(tagNames);
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
        ctx.body = new ErrorMessages("params error", e.toString().split('\n'));
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
