const Store = require('openrecord/store/sqlite3');

module.exports = class Post extends Store.BaseModel {
    static definition() {
        this.attribute('id', 'integer', {primary: true});
        // this.attribute('title', 'string');
        // this.attribute('body', 'string');
        // this.attribute('is_private', 'boolean');
        // this.attribute('album_id', 'integer');
        // this.attribute('created_on', 'datetime');

        this.belongsTo('album', {model: 'Album', from: 'album_id', to: 'id'});
        this.hasMany('comments', {
            model: 'Comment',
            from: 'id',
            to: 'post_id',
            dependent: 'destroy'
        });
        this.hasMany('post_tags', {
            model: 'PostTag',
            from: 'id',
            to: 'post_id',
            dependent: 'destroy'
        });
        this.hasMany('tags', {model: 'Tag', through: 'post_tags'});

        this.convertOutput('is_private', value => Boolean(value), false);
        this.convertInput('is_private', value => value ? 1 : 0, false);
        this.convertOutput('created_on', value => value, false);
    }
};