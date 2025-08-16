import { Request, Router } from "express";
// import { limiter } from "..";
import validatorMiddleware from "../middleware/validator.middleware";
import SuiService from "../service/sui.service";
import TokenRequestRepository from "../repository/token-request.repository";
import ResponseMapper from "../mapper/response.mapper";
import StatusCode from "../enum/status-code.enum";
import { SuiAirdrop, suiAirdropSchema } from "../schema/sui.schema";
import { Chain } from "../enum/chain.enum";
import { Network } from "../enum/network.enum";
import rateLimit from "express-rate-limit";
import ResponseStatus from "../enum/response-status.enum";
import { limiter } from "../utils/rate-limiter.util";


export const suiRouter = Router({
    mergeParams: true,
    caseSensitive: true,
    strict: true
});



suiRouter.route("/health-check")
.get((req, res, next) => {
    return ResponseMapper.success(res, "API is running", StatusCode.OK);
})


suiRouter.route("/airdrop")
.post(limiter, validatorMiddleware(suiAirdropSchema), async (req: Request<{}, {}, SuiAirdrop["body"]>, res, next) => {
    try{
        let suiService = new SuiService();
        await suiService.airdrop(req.body.address, req.body.amount);
        let tokenRequestRepository = new TokenRequestRepository();
        await tokenRequestRepository.create({
            address: req.body.address,
            amount: 10,
            chain: Chain.SUI,
            network: Network.Devnet
        });
        console.log("SUI airdropped successfully");

        return ResponseMapper.success(res, "SUI airdropped successfully", StatusCode.OK);
    }catch(e: any){
        next(e);
    }
})