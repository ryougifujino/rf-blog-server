const Store = require('openrecord/store/sqlite3');

module.exports = class Reply extends Store.BaseModel {
    static definition() {
        this.attribute('id', 'integer', {primary: true});
        // this.attribute('content', 'string');
        // this.attribute('from_user)', 'string');
        // this.attribute('comment_id', 'integer');
        // this.attribute('created_on', 'datetime');

        this.belongsTo('comment', {model: 'Comment', from: 'comment_id', to: 'id'});

        this.convertOutput('created_on', value => value, false);
    }
};