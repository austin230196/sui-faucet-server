import {createClient} from "redis";




export const client = createClient();

client.on("error", (err: any) => {
    console.log("[*] Redis error", err);
})

client.on("connect", () => {
    console.log("[*] Redis connected");
})

client.on("ready", () => {
    console.log("[*] Redis ready");
})

client.on("disconnect", () => {
    console.log("[*] Redis disconnected");
})

client.on("reconnecting", () => {
    console.log("[*] Redis reconnecting");
})