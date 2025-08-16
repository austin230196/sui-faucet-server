import { Request, Router } from "express";

import ResponseMapper from "../mapper/response.mapper";
import StatusCode from "../enum/status-code.enum";
import validatorMiddleware from "../middleware/validator.middleware";
import { SolanaAirdrop, solanaAirdropSchema } from "../schema/solana.schema";
import SolanaService from "../service/solana.service";
import TokenRequestRepository from "../repository/token-request.repository";
import { Chain } from "../enum/chain.enum";
import { limiter } from "../utils/rate-limiter.util";


export const solanaRouter = Router({
    mergeParams: true,
    caseSensitive: true,
    strict: true
});


solanaRouter.route("/health-check")
.get((req, res, next) => {
    return ResponseMapper.success(res, "API is running", StatusCode.OK);
})


solanaRouter.route("/airdrop")
.post(limiter, validatorMiddleware(solanaAirdropSchema), async(req: Request<{}, {}, SolanaAirdrop["body"], SolanaAirdrop["query"]>, res, next) => {
    try{
        let solanaService = new SolanaService();
        let txHash: string |  null = null;
        if(req.query.network === "testnet"){
            txHash = await solanaService.airdropTestnet(req.body.address, req.body.amount);
            console.log("[*] Airdropped successfully", txHash);
        }else {
            txHash = await solanaService.airdropDevnet(req.body.address, req.body.amount);
            console.log("[*] Airdropped successfully", txHash);
        }

        let tokenRequestRepository = new TokenRequestRepository();
        await tokenRequestRepository.create({
            address: req.body.address,
            amount: req.body.amount,
            chain: Chain.Solana,
            network: req.query.network,
        });

        if(!txHash){
            return ResponseMapper.error(res, "Transaction failed", StatusCode.INTERNAL_SERVER_ERROR);
        }

        return ResponseMapper.success(res, "Transaction successful", StatusCode.OK, {txHash});
    }catch(e: any){
        console.log("[*] Error", e);
        next(e);
    }
})