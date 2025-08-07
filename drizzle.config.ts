import { defineConfig } from 'drizzle-kit';
import config from './src/config/index.config';



export default defineConfig({
  out: './drizzle',
  schema: './src/model/*.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: `postgresql://${config.db.postgres.user}:${config.db.postgres.password}@${config.db.postgres.host}:${config.db.postgres.port}/${config.db.postgres.name}`,
  },
});