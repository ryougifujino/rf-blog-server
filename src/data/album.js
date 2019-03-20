const Store = require('openrecord/store/sqlite3');

module.exports = class Album extends Store.BaseModel {
    static definition() {
        this.attribute('id', 'integer', {primary: true});
        // this.attribute('name', 'string');
        // this.attribute('created_on', 'datetime');

        this.hasMany('posts', {model: 'Post', from: 'id', to: 'album_id'});

        this.convertOutput('created_on', value => new Date(value), false);
    }
};