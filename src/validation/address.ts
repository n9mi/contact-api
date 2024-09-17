import { z, ZodType } from "zod";

export class AddressValidation {

    static readonly LIST: ZodType = z.object({
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

    static readonly SAVE: ZodType = z.object({
        street: z.string({
                invalid_type_error: "street should be string"
            }).min(1, {
                message: "street length should more than 1 characters"
            }).max(100, {
                message: "street length should less than 100 characters"
            }).optional(),
        city: z.string({
                invalid_type_error: "city should be string"
            }).min(1, {
                message: "city length should more than 1 characters"
            }).max(100, {
                message: "city length should less 100 characters"
            }).optional(),
        province: z.string({
                invalid_type_error: "province should be string"
            }).min(1, {
                message: "province length should more than 1 characters"
            }).max(100, {
                message: "province length should less 100 characters"
            }).optional(),
        country: z.string({
                required_error: "country is required",
                invalid_type_error: "country should be string"
            }).min(1, {
                message: "country length should more than 1 characters"
            }).max(100, {
                message: "country length should less than 100 characters"
            }),
        postal_code: z.string({
                required_error: "postal code is required",
                invalid_type_error: "postal code should be string"
            }).min(5, {
                message: "postal code length should more than or equal 5 characters"
            }).max(20, {
                message: "postal code length should less than 20 characters"
            })
    });
}