import * as dotenv from 'dotenv';
import { bool, cleanEnv, port, str } from 'envalid';

dotenv.config();

const env = cleanEnv(process.env, {
  HOST: str({ default: undefined }),
  PORT: port({ default: 3001 }),
  API_URL: str({ default: '/' }),
  FRONTEND_URL: str({ default: '/' }),

  SWAGGER_ENABLED: bool({ default: false, devDefault: true }),
  CORS: bool({ default: true, devDefault: true }),

  POSTGRES_URL: str(),
  ORM_SYNCHRONIZE: bool({ default: false, devDefault: false }),
});

const _AppConfig = () => ({ ...env } as const);

const CONFIG = _AppConfig();
export const AppConfig = () => CONFIG;
