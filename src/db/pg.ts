import {drizzle} from "drizzle-orm/node-postgres";
import config from "../config/index.config";



const db = drizzle(`postgresql://${config.db.postgres.user}:${config.db.postgres.password}@${config.db.postgres.host}:${config.db.postgres.port}/${config.db.postgres.name}`)


export default db;