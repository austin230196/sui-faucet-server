import http from "http";
import path from "path";


import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import config from "./config/index.config";
import { AddressInfo } from "net";
import AdvancedError from "./error/advanced.error";
import StatusCode from "./enum/status-code.enum";
import ResponseMapper from "./mapper/response.mapper";
import { client } from "./db/redis.db";
import indexRouter from "./routes/index.route";

const app = express();
const server = http.createServer(app);



app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use((req, res, next) => {
    console.log(`[*] ${req.method} ${req.url}`, JSON.stringify(req.body, null, 2));
    next();
})
app.use(cors());


app.use("/v1", indexRouter);


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