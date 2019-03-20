const Store = require('openrecord/store/sqlite3');

const Album = require('./album');
const Comment = require('./comment');
const Post = require('./post');
const PostTag = require('./post-tag');
const Reply = require('./reply');
const Share = require('./share');
const ShareCategory = require('./share-category');
const Tag = require('./tag');

const models = [Album, Comment, Post, PostTag, Reply, Share, ShareCategory, Tag];

const store = new Store({
    type: 'sqlite3',
    file: __dirname + '/rf-blog.sqlite3',
    autoLoad: true
});

models.forEach(model => store.Model(model));

async function openDB() {
    await store.connect();
    await store.ready();
    console.log('database connected');
}

async function closeDB() {
    await store.close();
    console.log('database closed');
}

module.exports = {
    openDB,
    closeDB,
    Album,
    Comment,
    Post,
    PostTag,
    Reply,
    Share,
    ShareCategory,
    Tag
};