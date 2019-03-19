const Store = require('openrecord/store/sqlite3');

module.exports = class Share extends Store.BaseModel {
    static definition() {
        this.attribute('id', 'integer', {primary: true});
        this.attribute('title', 'string');
        this.attribute('url', 'string');
        this.attribute('share_category_id', 'integer');
        this.attribute('created_on', 'datetime');

        this.belongsTo('share_category', {
            model: 'ShareCategory',
            from: 'share_category_id',
            to: 'id'
        });
    }
};