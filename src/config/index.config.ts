import {config} from "dotenv";

//load the env file
config();


export default {
    app: {
        name: process.env.APP_NAME,
        port: process.env.PORT,
        env: process.env.NODE_ENV,
    },
    db: {
        redis: {
            url: process.env.REDIS_URL,
            name: process.env.REDIS_NAME,
            user: process.env.REDIS_USER,
        },
        postgres: {
            // url: process.env.MYSQL_URL,
            name: process.env.POSTGRES_NAME,
            user: process.env.POSTGRES_USER,
            host: process.env.POSTGRES_HOST,
            port: process.env.POSTGRES_PORT,
            password: process.env.POSTGRES_PASSWORD,
        }
    },
    sui: {
        url: process.env.SUI_URL,
        network: process.env.SUI_NETWORK,
    }
}