import { NextFunction, Request, Response } from "express";
import { z } from "zod";


/**
 * @description This middleware is used to validate the request body
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 */
export default async function (req: Request, res: Response, next: NextFunction){
    try{
        let schema = z.object({
            address: z.string().min(1, "Address is required"),
            amount: z.number().min(1, "Amount is required")
        })
        await schema.parseAsync(req.body);
        console.log("[*] Request body validated successfully");
        next();
    }catch(e: any){
        next(e);
    }
}