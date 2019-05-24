const Joi = require('@hapi/joi');

function validate(ctx, schema, value) {
    const {error} = Joi.validate(value, schema);
    if (error) {
        ctx.status = 400;
        ctx.body = error.details.map(({message}) => message);
        return false;
    }
    return true;
}

function buildSchema(builder) {
    return Joi.object().keys(builder(Joi));
}

module.exports = {
    validate,
    buildSchema
};
