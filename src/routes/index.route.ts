import { NextFunction, Request, Response, Router } from "express";

import { suiRouter } from "./sui.route";
import ResponseMapper from "../mapper/response.mapper";
import TokenRequestRepository from "../repository/token-request.repository";
import StatusCode from "../enum/status-code.enum";
import { z } from "zod";
import validatorMiddleware from "../middleware/validator.middleware";
import { GetAnalytics, getAnalyticsSchema, GetRecentRequests, getRecentRequestsSchema } from "../schema/index.schema";
import { solanaRouter } from "./solana.route";


const indexRouter = Router({
    mergeParams: true,
    caseSensitive: true,
    strict: true
});


indexRouter.use("/sui", suiRouter);

indexRouter.use("/solana", solanaRouter);

indexRouter.route("/recent-requests")
.get(validatorMiddleware(getRecentRequestsSchema), async (req: Request<{}, GetRecentRequests["query"]>, res: Response, next: NextFunction) => {
    try{
        let tokenRequestRepository = new TokenRequestRepository();
        let recentRequests = await tokenRequestRepository.getRecentRequests(req.query.chain as string, req.query.network as string, req.query.limit as any || 10);

        return ResponseMapper.success(res, "Recent requests fetched successfully", StatusCode.OK, recentRequests);
    }catch(e: any){next(e)}
})

indexRouter.route("/analytics")
.get(validatorMiddleware(getAnalyticsSchema), async (req: Request<{}, GetAnalytics["query"]>, res, next) => {
    try{
        let tokenRequestRepository = new TokenRequestRepository();
        let analytics = await tokenRequestRepository.getAnalytics(req.query.chain as string, req.query.network as string);

        return ResponseMapper.success(res, "Analytics fetched successfully", StatusCode.OK, analytics);
    }catch(e: any){next(e);}
})



export default indexRouter;