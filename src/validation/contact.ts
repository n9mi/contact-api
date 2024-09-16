import { z, ZodType } from "zod";

export class ContactValidation {
    static readonly CREATE: ZodType = z.object({
        first_name: z.string({
            required_error: "first name is required",
            invalid_type_error: "first name should be string"
            }).min(1, {
                message: "first name length should more than 1 character"
            }).max(100, {
                message: "first name length should less than 100 character"
            }),
        last_name: z.string({
            invalid_type_error: "last name should be string"
            }).min(1, {
                message: "last name length should more than 1 character"
            }).max(100, {
                message: "last name length should less than 100 character"
            }).optional(),
        email: z.string({
            invalid_type_error: "email should be string"
            }).email({
                message: "email should be valid"
            }).min(1, {
                message: "email length should more than 1 character"
            }).max(100, {
                message: "email length should less than 100 character"
            }).optional(),
        phone: z.string({
            invalid_type_error: "phone should be string"
            }).min(1, {
                message: "phone length should more than 1 character"
            }).max(20, {
                message: "phone length should less than 20 character"
            }).optional(),
    });

    static readonly SEARCH: ZodType = z.object({
        name: z.string({
                invalid_type_error: "first name should be string"
            }).min(1, {
                message: "first name length should more than 1 character"
            }).optional(),
        phone: z.string({
                invalid_type_error: "phone should be string"
            }).min(1, {
                message: "phone length should more than 1 character"
            }).optional(),
        email: z.string({
                invalid_type_error: "email should be string"
            }).min(1, {
                message: "email length should more than 1 character"
            }).optional(),
        page: z.number({
            invalid_type_error: "page should be a number"
            }).min(1, {
                message: "page should be at least equal to 1"
            }).positive(),
        page_size: z.number({
                invalid_type_error: "page_size should be a number"
            }).min(1, {
                message: "page should be at least equal to 1"
            }).max(100, {
                message: "page_size can't be more than 100"
            }).positive(),
    });
}