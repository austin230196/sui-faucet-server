import http from "http";
import path from "path";


import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import {rateLimit} from "express-rate-limit";
import {RedisStore} from "rate-limit-redis";

import config from "./config/index.config";
import { AddressInfo } from "net";
import AdvancedError from "./error/advanced.error";
import StatusCode from "./enum/status-code.enum";
import ResponseMapper from "./mapper/response.mapper";
import SuiService from "./service/sui.service";
import validatorMiddleware from "./middleware/validator.middleware";
import { client } from "./db/redis.db";
import ResponseStatus from "./enum/response-status.enum";
import TokenRequestRepository from "./repository/token-request.repository";

const app = express();
const server = http.createServer(app);

const limiter = rateLimit({
    windowMs: 20 * 60 * 1000,
    limit: 1,
    message: {
        message: "Too many requests, please try again later",
        status: ResponseStatus.ERROR
    },
    legacyHeaders: false,
    // store: new RedisStore({
    //     sendCommand: (...args: string[]) => client.sendCommand(args)
    // })
})



app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use((req, res, next) => {
    console.log(`[*] ${req.method} ${req.url}`, JSON.stringify(req.body, null, 2));
    next();
})
app.use(cors());



/**
 * @description Health check endpoint
 * @returns {Response} - A response with a message and a status code
 */
app.get("/health-check", (req, res, next) => {
    return ResponseMapper.success(res, "API is running", StatusCode.OK);
})


/**
 * @description Airdrop endpoint
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 * @returns {Response} - A response with a message and a status code
 */
app.post("/airdrop", limiter, validatorMiddleware, async (req, res, next) => {
    try{
        let suiService = new SuiService();
        await suiService.airdrop(req.body.address, req.body.amount);
        let tokenRequestRepository = new TokenRequestRepository();
        await tokenRequestRepository.create({
            address: req.body.address,
            amount: 10,
        });
        console.log("SUI airdropped successfully");

        return ResponseMapper.success(res, "SUI airdropped successfully", StatusCode.OK);
    }catch(e: any){
        next(e);
    }
})



/**
 * @description Recent requests endpoint
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 * @returns {Response} - A response with a message and a status code
 */
app.get("/recent-requests", async (req, res, next) => {
    try{
        let tokenRequestRepository = new TokenRequestRepository();
        let recentRequests = await tokenRequestRepository.getRecentRequests(req.query.limit as any || 10);

        return ResponseMapper.success(res, "Recent requests fetched successfully", StatusCode.OK, recentRequests);
    }catch(e: any){next(e)}
})



/**
 * @description Analytics endpoint
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 * @returns {Response} - A response with a message and a status code
 */
app.get("/analytics", async (_, res, next) => {
    try{
        let tokenRequestRepository = new TokenRequestRepository();
        let analytics = await tokenRequestRepository.getAnalytics();

        return ResponseMapper.success(res, "Analytics fetched successfully", StatusCode.OK, analytics);
    }catch(e: any){
        next(e);
    }
})


app.use((req, res, next) => {
    let error = new AdvancedError("Oops! You are lost", StatusCode.BAD_REQUEST);
    next(error);
})

app.use((err: any, _: Request, res: Response, next: NextFunction) => {
    let statusCode = err.statusCode || StatusCode.INTERNAL_SERVER_ERROR;
    let message = err.message || "Internal Server Error";

    return ResponseMapper.error(res, message, statusCode);
})


server.listen(config.app.port);


server.on("error", async err => {
    console.error(err);
    await client.disconnect();
    process.exit(1);
})


server.on("listening", async () => {
    try{
        const address: AddressInfo = server.address() as AddressInfo;
        await client.connect();
        console.log(`Server is running on port http://${address.address}:${address.port} on family ${address.family}`);
    }catch(e: any){
        console.error("Error starting the server", e);
    }
})



//final app kill switch
process.on("SIGINT", () => {
    console.log("[*] SIGINT signal received: closing HTTP server");
    server.close(async () => {
        console.log("[*] HTTP server closed");
        await client.disconnect();
        process.exit(0);
    });
});