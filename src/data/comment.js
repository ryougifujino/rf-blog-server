const Store = require('openrecord/store/sqlite3');

module.exports = class Comment extends Store.BaseModel {
    static definition() {
        this.attribute('id', 'integer', {primary: true});
        this.attribute('content', 'string');
        this.attribute('from', 'string');
        this.attribute('post_id', 'integer');
        this.attribute('created_on', 'datetime');

        this.hasMany('replies', {model: 'Reply', from: 'id', to: 'comment_id'});
        this.belongsTo('comment', {model: 'Comment', from: 'post_id', to: 'id'});
    }
};