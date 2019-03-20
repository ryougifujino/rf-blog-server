const app = require('../lib/app');
const db = require('../data');

async function main() {
    await db.openDB();
    app.listen(3000);
}

main();