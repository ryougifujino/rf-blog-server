const Store = require('openrecord/store/sqlite3');

module.exports = class PostTag extends Store.BaseModel {
    static definition() {
        this.tableName = 'post_tag';
        // this.attribute('post_id', 'integer');
        // this.attribute('tag_id', 'integer');

        this.belongsTo('posts', {model: 'Post', from: 'post_id', to: 'id'});
        this.belongsTo('tags', {model: 'Tag', from: 'tag_id', to: 'id'});
    }
};