const Store = require('openrecord/store/sqlite3');

module.exports = class Tag extends Store.BaseModel {
    static definition() {
        this.attribute('id', 'integer', {primary: true});
        // this.attribute('name', 'string');
        // this.attribute('created_on', 'datetime');

        this.hasMany('tag_posts', {model: 'PostTag', from: 'id', to: 'tagId'});
        this.hasMany('posts', {model: 'Post', through: 'tag_posts'});

        this.convertOutput('created_on', value => value, false);
    }
};