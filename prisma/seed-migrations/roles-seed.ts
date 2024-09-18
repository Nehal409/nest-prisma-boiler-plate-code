import { PrismaClient } from '@prisma/client';
import { roles } from 'prisma/seed-data/roles';

const prisma = new PrismaClient();

export const roleSeed = async () => {
  const seedName = 'role-seed';

  // Check if the seed has already been executed
  const existingSeed = await prisma.seedHistory.findUnique({
    where: { name: seedName },
  });

  if (existingSeed) {
    console.log(`Seed ${seedName} already executed.`);
    return;
  }

  const rolesData = roles.map((role) => ({
    id: role.id,
    name: role.name,
    description: role.description,
  }));

  await prisma.role.createMany({
    data: rolesData,
  });

  // Record this seed as executed
  await prisma.seedHistory.create({
    data: {
      name: seedName,
    },
  });

  console.log(`Seed ${seedName} completed.`);
};
