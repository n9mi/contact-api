import { z, ZodType } from "zod";

export class UserValidation {
    static readonly INFO: ZodType = z.object({
        username: z.string({
                invalid_type_error: "username should be string",
            }).min(4, {
                message: "username should be more than 4 characters"
            }).max(100, {
                message: "username should less than 100 characters"
            }).optional(),
        name: z.string({
                invalid_type_error: "name should be string",
            }).min(1, {
                message: "name should be more than 1 characters"
            }).max(100, {
                message: "name should less than 100 characters"
            }).optional(),
        password: z.string({
                invalid_type_error: "password should be string",
            }).min(6, {
                message: "password should be more than 6 characters"
            }).max(100, {
                message: "password should less than 100 characters"
            }).optional(),
    })
}