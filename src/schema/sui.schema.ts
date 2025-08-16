import { z } from "zod";


export const suiAirdropSchema = z.object({
    body: z.object({
        address: z.string().min(1, "Address is required"),
        amount: z.number().min(1, "Amount is required")
    })
})



export type SuiAirdrop = z.infer<typeof suiAirdropSchema>;
