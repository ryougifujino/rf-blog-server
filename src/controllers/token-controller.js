const fs = require('fs');
const md5 = require('md5');
const memoryCache = require('../lib/memory-cache');
const {ErrorMessages} = require("../data/body-templates");
const {CREDENTIAL_PATH} = require('../common/config');
const {COOKIE_NAME_TOKEN} = require('../common/constants');

const post = ctx => {
    const {credential} = ctx.request.body;
    const storedCredential = fs.readFileSync(CREDENTIAL_PATH).toString().trim();
    if (credential === storedCredential) {
        const token = md5(credential + new Date().getTime());
        ctx.cookies.set(COOKIE_NAME_TOKEN, token);
        memoryCache.setItem(COOKIE_NAME_TOKEN, token);
        ctx.status = 200;
    } else {
        ctx.status = 400;
        ctx.body = new ErrorMessages("params error", ['wrong credential']);
    }
};

const del = ctx => {
    memoryCache.setItem(COOKIE_NAME_TOKEN, '');
    ctx.status = 204;
};

const getOne = ctx => {
    ctx.status = 200;
};

module.exports = {
    post,
    del,
    getOne
};
