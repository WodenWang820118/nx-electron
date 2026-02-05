import { DataSource } from 'typeorm';
import { dataBaseConfig } from './database.config';

export const AppDataSource = new DataSource(dataBaseConfig);

export async function initializeDatabase(): Promise<DataSource> {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established successfully');
    return AppDataSource;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}
