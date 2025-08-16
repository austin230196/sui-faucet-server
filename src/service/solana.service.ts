import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

import AdvancedError from "../error/advanced.error";
import config from "../config/index.config";


/**
 * @description This class is used to interact with the Solana network
 * @author {Akamelu Sopuru}
 */
export default class SolanaService {

    /**
     * @description This method is used to airdrop Solana to an address on the devnet
     * @param {string} address - The address to airdrop to
     * @param {number} amount - The amount of Solana to airdrop
     * @returns {Promise<void>} - A promise that resolves when the airdrop is complete
     */
    public async airdropDevnet(address: string, amount: number): Promise<string>{
        try{
            const connection = new Connection(clusterApiUrl('devnet'));
            const signature = await connection.requestAirdrop(new PublicKey(address), amount * LAMPORTS_PER_SOL);
            await connection.confirmTransaction(signature);

            return signature;
        }catch(e: any){
            throw new AdvancedError(e.message, e.statusCode);
        }
    }

    /**
     * @description This method is used to airdrop Solana to an address on the testnet
     * @param {string} address - The address to airdrop to
     * @param {number} amount - The amount of Solana to airdrop
     * @returns {Promise<void>} - A promise that resolves when the airdrop is complete
     */
    public async airdropTestnet(address: string, amount: number): Promise<string>{
        try{
            const connection = new Connection(clusterApiUrl('testnet'));
            const signature = await connection.requestAirdrop(new PublicKey(address), amount * LAMPORTS_PER_SOL);
            await connection.confirmTransaction(signature);

            return signature;
        }catch(e: any){
            throw new AdvancedError(e.message, e.statusCode);
        }
    }
}