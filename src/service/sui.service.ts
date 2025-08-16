import {requestSuiFromFaucetV2, getFaucetHost} from "@mysten/sui/faucet";

import AdvancedError from "../error/advanced.error";
import config from "../config/index.config";


/**
 * @description This class is used to interact with the Sui network
 * @author {Akamelu Sopuru}
 */
export default class SuiService {

    /**
     * @description This method is used to airdrop SUI to an address
     * @param {string} address - The address to airdrop to
     * @param {number} amount - The amount of SUI to airdrop
     * @returns {Promise<void>} - A promise that resolves when the airdrop is complete
     */
    public async airdrop(address: string, amount: number){
        try{
            await requestSuiFromFaucetV2({
                host: getFaucetHost(config.sui.network as "testnet" | "devnet" | "localnet"),
                recipient: address
            })
        }catch(e: any){
            throw new AdvancedError(e.message, e.statusCode);
        }
    }
}