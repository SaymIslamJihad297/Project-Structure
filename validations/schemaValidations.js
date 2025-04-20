const joi = require('joi');

module.exports.userSchemaValidator = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    role: joi.string().optional(),
})

module.exports.LoginFormValidator = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
})