import { faker } from '@faker-js/faker';
import { prisma } from '../lib/prisma';
import { PropertyType } from '@prisma/client';

async function main() {
  console.log('Starting seed...');

  // Clean up existing data for a fresh seed
  await prisma.property.deleteMany();
  await prisma.agent.deleteMany();

  console.log('Cleared existing data.');

  // Create 5 Agents
  const agents = [];
  for (let i = 0; i < 5; i++) {
    const agent = await prisma.agent.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
      },
    });
    agents.push(agent);
  }

  console.log(`Created ${agents.length} agents.`);

  // Create 40 Properties
  const propertiesData = [];
  const propertyTypes = [PropertyType.APARTMENT, PropertyType.HOUSE, PropertyType.VILLA];

  for (let i = 0; i < 40; i++) {
    const randomAgent = faker.helpers.arrayElement(agents);
    const type = faker.helpers.arrayElement(propertyTypes);

    propertiesData.push({
      name: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      price: faker.number.int({ min: 200, max: 2000 }) * 1000,
      beds: faker.number.int({ min: 1, max: 5 }),
      baths: faker.number.int({ min: 1, max: 4 }),
      type,
      suburb: faker.location.city(),
      agentId: randomAgent.id,
      metaData: {
        squareFeet: faker.number.int({ min: 500, max: 5000 }),
        yearBuilt: faker.number.int({ min: 1950, max: 2024 }),
        hasPool: faker.datatype.boolean(),
        hasGarage: faker.datatype.boolean(),
      }
    });
  }

  const result = await prisma.property.createMany({
    data: propertiesData,
  });

  console.log(`Created ${result.count} properties.`);
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
