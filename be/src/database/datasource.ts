import { DataSource } from 'typeorm';
import { datasourceConfig } from './database.module';

// Data source is used with typeorm cli
const connectionSource = new DataSource(datasourceConfig());
export default connectionSource;
