const {Post, PostTag, Tag} = require('../data');
const DateUtils = require('../lib/date-utils');
const SetUtils = require('../lib/set-utils');

const POST_PREVIEW_LENGTH = 500;

const get = async ctx => {
    const {offset, limit} = ctx.query;
    const posts = await Post.limit(limit, offset).order('created_on', true);
    posts.forEach(post => post.body = post.body.substr(0, POST_PREVIEW_LENGTH));
    ctx.body = posts.toJson();
};

async function filterTagIdsNotExist(tagIds) {
    if (!tagIds || !Array.isArray(tagIds)) {
        throw new TypeError("tagIds is not a array");
    }
    const tags = await Tag.find(tagIds);
    return tags ? tags.map(tag => tag.id) : [];
}

const post = async ctx => {
    try {
        const {post: {title, body, is_private, album_id, tag_ids} = {}} = ctx.request.body;
        const post = await Post.create({
            title,
            body,
            is_private,
            album_id,
            created_on: DateUtils.nowUtcDateTimeString()
        });
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
        }
        ctx.body = {message: "success"};
    } catch (e) {
        ctx.status = 400;
        ctx.body = {message: "params error", errors: e.toString().split('\n')};
    }
};

const patch = async ctx => {
    const postId = ctx.params.id;
    try {
        const {post: {title, body, is_private, album_id, tag_ids} = {}} = ctx.request.body;
        const post = await Post.find(postId);
        if (!post) {
            ctx.status = 400;
            ctx.body = {message: "params error", errors: ["invalid post id"]};
            return;
        }
        await post.update({
            title,
            body,
            is_private,
            album_id
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
        ctx.body = {message: "success"};
    } catch (e) {
        console.error(e);
        ctx.status = 400;
        ctx.body = {message: "params error", errors: e.toString().split('\n')};
    }
};

module.exports = {
    get,
    post,
    patch
};