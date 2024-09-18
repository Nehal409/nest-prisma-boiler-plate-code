import { roleSeed } from './seed-migrations/roles-seed';

const main = async () => {
  await roleSeed();

  console.log('Database seeded successfully!');
  process.exit();
};

main();
