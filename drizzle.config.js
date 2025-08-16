"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
const index_config_1 = __importDefault(require("./src/config/index.config"));
exports.default = (0, drizzle_kit_1.defineConfig)({
    out: './drizzle',
    schema: './src/model/*.model.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: `postgresql://${index_config_1.default.db.postgres.user}:${index_config_1.default.db.postgres.password}@${index_config_1.default.db.postgres.host}:${index_config_1.default.db.postgres.port}/${index_config_1.default.db.postgres.name}`,
    },
});
