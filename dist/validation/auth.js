"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
class AuthValidation {
}
exports.AuthValidation = AuthValidation;
AuthValidation.REGISTER = zod_1.z.object({
    username: zod_1.z.string({
        invalid_type_error: "username should be string",
        required_error: "username is required",
    }).min(4, {
        message: "username should be more than 4 characters"
    }).max(100, {
        message: "username should less than 100 characters"
    }),
    name: zod_1.z.string({
        invalid_type_error: "name should be string",
        required_error: "name is required",
    }).min(1, {
        message: "name should be more than 1 characters"
    }).max(100, {
        message: "name should less than 100 characters"
    }),
    password: zod_1.z.string({
        invalid_type_error: "password should be string",
        required_error: "password is required",
    }).min(6, {
        message: "password should be more than 6 characters"
    }).max(100, {
        message: "password should less than 100 characters"
    }),
});
AuthValidation.LOGIN = zod_1.z.object({
    username: zod_1.z.string({
        invalid_type_error: "username should be string",
        required_error: "username is required",
    }).min(1, {
        message: "username can't be empty"
    }),
    password: zod_1.z.string({
        invalid_type_error: "password should be string",
        required_error: "password is required",
    }).min(1, {
        message: "password can't be empty"
    })
});
