const posts = require('./posts-controller');
const albums = require('./albums-controller');
const comments = require('./comments-controller');
const replies = require('./replies-controller');
const shares = require('./shares-controller');

module.exports = {
    posts,
    albums,
    comments,
    replies,
    shares
};