const {Album, Post, PostTag, Tag} = require('../data');
const {ErrorMessages, Pagination} = require('../data/body-templates');
const DateUtils = require('../lib/date-utils');
const SetUtils = require('../lib/set-utils');

const POST_PREVIEW_LENGTH = 500;
const TITLE_LENGTH_LIMIT = 200;

const get = async ctx => {
    const {offset, limit} = ctx.query;
    const posts = (await Post.limit(limit, offset).order('created_on', true)).toJson();
    posts.forEach(post => post.body = post.body.substr(0, POST_PREVIEW_LENGTH));
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

async function filterTagIdsNotExist(tagIds) {
    if (!tagIds || !Array.isArray(tagIds)) {
        throw new TypeError("tagIds is not a array");
    }
    const tags = await Tag.find(tagIds);
    return tags ? tags.map(tag => tag.id) : [];
}

const post = async ctx => {
    const {post: {title, body, is_private, album_id, tag_ids} = {}} = ctx.request.body;
    if (title && title.length > TITLE_LENGTH_LIMIT) {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", ['title length exceeds limitation']);
        return;
    }
    let albumId = await Album.find(album_id);
    albumId = albumId ? albumId : undefined;
    try {
        const post = (await Post.create({
            title,
            body,
            is_private,
            album_id: albumId,
            created_on: DateUtils.nowUtcDateTimeString()
        })).toJson();
        if (tag_ids && Array.isArray(tag_ids)) {
            const tagIdsToSave = await filterTagIdsNotExist(tag_ids);

            // // get all tags of this post (should be empty, because the post is a new one)
            // const postTags = await PostTag.where({post_id: post.id}).include('tags');
            // // filter all existed tag ids to get `tagIdsToSave`
            // const postTagIds = {};
            // postTags.forEach(postTag => (postTagIds[postTag.id] = true));
            // const tagIdsToSave = tag_ids.filter(tag_id => !postTagIds[tag_id]);

            const postTagsToSave = tagIdsToSave.map(tagId => ({post_id: post.id, tag_id: tagId}));
            await PostTag.create(postTagsToSave);
            post.tags_id = tagIdsToSave;
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
    const {post: {title, body, is_private, album_id, tag_ids} = {}} = ctx.request.body;
    if (title && title.length > TITLE_LENGTH_LIMIT) {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", ['title length exceeds limitation']);
        return;
    }
    const post = await Post.find(postId);
    if (!post) {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", ["invalid post id"]);
        return;
    }
    let albumId = await Album.find(album_id);
    albumId = albumId ? albumId : undefined;
    try {
        await post.update({
            title,
            body,
            is_private,
            album_id: albumId
        });
        if (Array.isArray(tag_ids) && tag_ids.length !== 0) {
            const validTags = await Tag.find(tag_ids);
            const validTagIds = validTags ? validTags.map(validTag => validTag.id) : [];
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