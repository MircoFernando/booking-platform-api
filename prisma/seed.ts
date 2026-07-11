import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Clearing database...');
  // Delete in order of dependencies (dependent tables first)
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding database...');

  // Create a default user
  const user = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      passwordHash: '$2b$10$EPf9XJdPhK5M.M7.Wq1vNu31P8dYwK25hWp5V1c7u4qN2Z2k4j1C.', // bcrypt hash for 'password123'
      name: 'John Doe',
    },
  });

  console.log(`Created user: ${user.name} (${user.email})`);

  // Create default services for the user
  const service1 = await prisma.service.create({
    data: {
      title: 'Consultation Session',
      description: 'A 1-on-1 consultation session regarding our platform and bookings.',
      duration: 60,
      price: 150.00,
      createdById: user.id,
    },
  });

  const service2 = await prisma.service.create({
    data: {
      title: 'Quick Checkup',
      description: 'A rapid 15-minute diagnostic evaluation.',
      duration: 15,
      price: 45.00,
      createdById: user.id,
    },
  });

  console.log('Created services:');
  console.log(`- ${service1.title} ($${service1.price})`);
  console.log(`- ${service2.title} ($${service2.price})`);

  // Create default bookings
  const booking1 = await prisma.booking.create({
    data: {
      serviceId: service1.id,
      customerName: 'Alice Smith',
      customerEmail: 'alice.smith@example.com',
      customerPhone: '+15550199',
      bookingDate: new Date('2026-07-15T00:00:00Z'),
      bookingTime: new Date('1970-01-01T10:00:00Z'), // DB Time column compatibility
      status: 'CONFIRMED',
      notes: 'Please call when you arrive.',
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      serviceId: service2.id,
      customerName: 'Bob Jones',
      customerEmail: 'bob.jones@example.com',
      customerPhone: '+15550188',
      bookingDate: new Date('2026-07-16T00:00:00Z'),
      bookingTime: new Date('1970-01-01T14:30:00Z'),
      status: 'PENDING',
      notes: 'No specific requirements.',
    },
  });

  console.log('Created bookings:');
  console.log(`- ${booking1.customerName} for ${service1.title}`);
  console.log(`- ${booking2.customerName} for ${service2.title}`);

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
