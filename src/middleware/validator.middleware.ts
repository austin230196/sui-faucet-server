import { NextFunction, Request, Response } from "express";
import { z } from "zod";


/**
 * @description This middleware is used to validate the request body
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 */
export default function (schema: z.ZodSchema){
    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            });
            console.log("[*] Request body validated successfully");
            next();
        }catch(e: any){
            if(e instanceof z.ZodError){
                return res
                .status(422)
                .json({
                    errors: e.issues,
                    status: "error"
                })
            }
        }
    }
}