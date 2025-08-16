import {z} from "zod";


export const getAnalyticsSchema = z.object({
    query: z.object({
        chain: z.enum(["sui", "solana", "binance", "eclipse"]),
        network: z.enum(["devnet", "testnet"])
    })
})


export const getRecentRequestsSchema = z.object({
    query: z.object({
        limit: z.number().min(1, "Limit is required").max(100, "Limit must be less than 100").optional(),
        chain: z.enum(["sui", "solana", "binance", "eclipse"]),
        network: z.enum(["devnet", "testnet"])
    })
})



export type GetAnalytics = z.infer<typeof getAnalyticsSchema>;


export type GetRecentRequests = z.infer<typeof getRecentRequestsSchema>;
