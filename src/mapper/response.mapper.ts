import { Response } from "express";
import ResponseStatus from "../enum/response-status.enum";




/**
 * @description This class is used to map the response to the client
 * @author {Akamelu Sopuru}
 */
export default class ResponseMapper {


    /**
     * 
     * @description This method is used to send a success response to the client
     * @param {Response} res - The response object
     * @param {string} message - The message to send to the client
     * @param {number} statusCode - The status code to send to the client
     * @param {any} data - The data to send to the client
     * @returns 
     */
    public static success(res: Response, message: string, statusCode: number, data?: any): Response {
        return res.status(statusCode).json({
            message,
            status: ResponseStatus.SUCCESS,
            data
        })
    }


    /**
     * @description This method is used to send an error response to the client
     * @param {Response} res - The response object
     * @param {string} message - The message to send to the client
     * @param {number} statusCode - The status code to send to the client
     * @returns 
     */
    public static error(res: Response, message: string, statusCode: number): Response {
        return res.status(statusCode).json({
            message,
            status: ResponseStatus.ERROR
        })
    }
}