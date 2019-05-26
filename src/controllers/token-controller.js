const fs = require('fs');
const {CREDENTIAL_PATH} = require('../common/config');
const AuthManager = require('../lib/auth-manager');

const post = ctx => {
    const {credential} = ctx.request.body;
    const storedCredential = fs.readFileSync(CREDENTIAL_PATH).toString().trim();
    if (credential === storedCredential) {
        AuthManager.setAuth(ctx, credential);
        ctx.status = 200;
    } else {
        ctx.status = 400;
        ctx.body = ['wrong credential'];
    }
};

const del = ctx => {
    AuthManager.clear();
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
