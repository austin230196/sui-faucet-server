import { z } from "zod";


export const solanaAirdropSchema = z.object({
    query: z.object({
        network: z.enum(["devnet", "testnet"])
    }),
    body: z.object({
        address: z.string().min(1, "Address is required"),
        amount: z.number().min(1, "Amount is required")
    })
})


export type SolanaAirdrop = z.infer<typeof solanaAirdropSchema>;