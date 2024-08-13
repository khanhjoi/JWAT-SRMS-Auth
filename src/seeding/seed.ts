import { runSeeders, SeederOptions } from 'typeorm-extension';
import { DataSource, DataSourceOptions } from 'typeorm';
import { options } from '../db/typeorm.config';
import { MainSeeder } from './main.seeder';

const SeederConfig: DataSourceOptions & SeederOptions = {
  ...options,
  factories: [],
  seeds: [MainSeeder],
};

const dataSource = new DataSource(SeederConfig);

dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
});
