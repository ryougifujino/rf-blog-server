const app = require('../lib/app');
const db = require('../data');
const {PORT} = require('../common/config');

async function main() {
    await db.openDB();
    app.listen(PORT);
}

main();
