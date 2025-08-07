import {desc, eq} from "drizzle-orm";

import { tokenRequest } from "../model/token-request.model";
import db from "../db/pg";
import AdvancedError from "../error/advanced.error";




export default class TokenRequestRepository {
    public constructor(){}

    /**
     *  @description Create a token request
     *  @param {typeof tokenRequest.$inferInsert} data - The data to create the token request with
     *  @returns {Promise<typeof tokenRequest.$inferSelect>} - The created token request
     */
    public async create(data: typeof tokenRequest.$inferInsert): Promise<typeof tokenRequest.$inferSelect>{
        try{
            let request = await db.insert(tokenRequest).values(data).returning();
            console.log("[*] Token request created successfully ", JSON.stringify(request, null, 4));

            return request[0];
        }catch(e: any){
            throw new AdvancedError(e.message, e.statusCode);
        }
    }


    /**
     *  @description Get recent token requests
     *  @param {number} len - The number of recent requests to get
     *  @returns {Promise<typeof tokenRequest.$inferSelect[]>} - The recent token requests
     */
    public async getRecentRequests(len: number): Promise<typeof tokenRequest.$inferSelect[]> {
        try{
            let requests = await db.select().from(tokenRequest).orderBy(desc(tokenRequest.createdAt)).limit(len);

            return requests;
        }catch(e: any){
            throw new AdvancedError(e.message, e.statusCode);
        }
    }


    /**
     *  @description Find all token requests
     *  @returns {Promise<typeof tokenRequest.$inferSelect[]>} - The token requests
     */
    public async findAll(): Promise<typeof tokenRequest.$inferSelect[]> {
        try{
            let requests = await db.select().from(tokenRequest);
            console.log("[*] Token requests fetched successfully ", JSON.stringify(requests, null, 4));

            return requests;
        }catch(e: any){
            throw new AdvancedError(e.message, e.statusCode);
        }
    }


    /**
     *  @description Get analytics
     *  @returns {Promise<{totalRequests: number, totalSuiDistributed: number, activeUsers: number}>} - The analytics
     */
    public async getAnalytics(): Promise<{
        totalRequests: number;
        totalSuiDistributed: number;
        activeUsers: number;
    }>
    {
        try{
            let requests = await this.findAll();
            let activeUsersToVists: Record<string, number> = {};
            for(let req of requests){
                activeUsersToVists[req.address] = activeUsersToVists[req.address] || 0;
                activeUsersToVists[req.address]++;
            }
            let totalRequests = requests.length;
            let totalSuiDistributed = requests.reduce((acc, request) => acc + request.amount, 0);
            let activeUsers = Object.keys(activeUsersToVists).length;
            return {
                totalRequests,
                totalSuiDistributed,
                activeUsers
            };
        }catch(e: any){
            throw new AdvancedError(e.message, e.statusCode);
        }
    }


    /**
     *  @description Find token requests by address
     *  @param {string} address - The address of the token requests
     *  @returns {Promise<typeof tokenRequest.$inferSelect[]>} - The token requests
     */
    public async findByAddress(address: string): Promise<typeof tokenRequest.$inferSelect[]> {
        try{
            let requests = await db.select().from(tokenRequest).where(eq(tokenRequest.address, address))
            console.log("[*] Requests fetched successfully for " + address);

            return requests;
        }catch(e: any){
            throw new AdvancedError(e.message, e.statusCode);
        }
    }


    /**
     *  @description Find token request by id
     *  @param {number} id - The id of the token request
     *  @returns {Promise<typeof tokenRequest.$inferSelect | null>} - The token request
     */
    public async findById(id: number): Promise<typeof tokenRequest.$inferSelect | null> {
        try{
            let foundRequest = (await db.select().from(tokenRequest).where(eq(tokenRequest.id, id)));
            console.log("[*] Token request fetched successfully ", JSON.stringify(foundRequest, null, 4));

            return foundRequest ? foundRequest[0] : null;
        }catch(e: any){
            throw new AdvancedError(e.message, e.statusCode);
        }
    }


    /**
     *  @description Update a token request
     *  @param {number} id - The id of the token request
     *  @param {typeof tokenRequest.$inferInsert} data - The data to update the token request with
     *  @returns {Promise<typeof tokenRequest.$inferSelect | null>} - The updated token request
     */
    public async update(id: number, data: typeof tokenRequest.$inferInsert): Promise<typeof tokenRequest.$inferSelect | null> {
        try{
            let updatedRequest = await db.update(tokenRequest).set(data).where(eq(tokenRequest.id, id)).returning();
            console.log("[*] Token request updated successfully ", JSON.stringify(updatedRequest, null, 4));

            return updatedRequest ? updatedRequest[0] : null;
        }catch(e: any){
            throw new AdvancedError(e.message, e.statusCode);
        }
    }


    /**
     *  @description Delete a token request
     *  @param {number} id - The id of the token request
     *  @returns {Promise<boolean>} - True if the token request was deleted, false otherwise
     */
    public async delete(id: number): Promise<boolean> {
        try{
            await db.delete(tokenRequest).where(eq(tokenRequest.id, id));
            console.log("[*] Token request deleted successfully for " + id);

            return true;
        }catch(e: any){
            throw new AdvancedError(e.message, e.statusCode);
        }
    }
}