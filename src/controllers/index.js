const posts = require('./posts-controller');
const albums = require('./albums-controller');
const comments = require('./comments-controller');
const replies = require('./replies-controller');

module.exports = {
    posts,
    albums,
    comments,
    replies
};