const Store = require('openrecord/store/sqlite3');

module.exports = class ShareCategory extends Store.BaseModel {
    static definition() {
        this.attribute('id', 'integer', {primary: true});
        // this.attribute('name', 'string');
        // this.attribute('created_on', 'datetime');

        this.hasMany('shares', {model: 'Share', from: 'id', to: 'share_category_id'});

        this.convertOutput('created_on', value => new Date(value), false);
    }
};