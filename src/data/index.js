const Store = require('openrecord/store/sqlite3');
const {DB_PATH} = require('../config');
const dbCreator = require('./db-creator');

const Album = require('./album');
const Comment = require('./comment');
const Post = require('./post');
const PostTag = require('./post-tag');
const Reply = require('./reply');
const Share = require('./share');
const ShareCategory = require('./share-category');
const Tag = require('./tag');

const models = [Album, Comment, Post, PostTag, Reply, Share, ShareCategory, Tag];

// try to create db
dbCreator();

const store = new Store({
    type: 'sqlite3',
    file: DB_PATH,
    autoLoad: true
});

models.forEach(model => store.Model(model));

async function openDB() {
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