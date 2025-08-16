import rateLimit from "express-rate-limit";
import {RedisStore} from "rate-limit-redis";
import { client } from "../db/redis.db";


import ResponseStatus from "../enum/response-status.enum";

export const limiter = rateLimit({
    windowMs: 20 * 60 * 1000,
    limit: 1,
    message: {
        message: "Too many requests, please try again later",
        status: ResponseStatus.ERROR
    },
    legacyHeaders: false,
    keyGenerator: (req) => {
        // Rate limit by address from request body
        return req.body.address;
    },
    // store: new RedisStore({
    //     sendCommand: (...args: string[]) => client.sendCommand(args)
    // })
})