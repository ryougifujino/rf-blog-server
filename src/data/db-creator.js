const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const {DB_PATH} = require('../config');

function create() {
    const db = new sqlite3.Database(DB_PATH);
    let dbCreationSql;
    try {
        dbCreationSql = fs.readFileSync(__dirname + '/db-creation.sql').toString();
    } catch (e) {
        console.error('db-creator.js', e);
    }

    dbCreationSql && db.exec(dbCreationSql, err => err && console.error('db-creator.js', err));
    db.close();
}

module.exports = function () {
    if (!fs.existsSync(DB_PATH)) {
        create();
    }
};