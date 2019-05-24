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

function buildSchema(value) {
    return Joi.object().keys(value);
}

module.exports = {
    validate,
    buildSchema,
    Joi
};
