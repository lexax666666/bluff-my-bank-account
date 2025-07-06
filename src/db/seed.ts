import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { phoneNumbers } from './schema';
import * as dotenv from 'dotenv';

dotenv.config();

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const client = postgres(connectionString);
  const db = drizzle(client);

  console.log('Seeding phone numbers...');

  const phoneNumbersToInsert = [
    { number: '+1234567890' },
    { number: '+1234567891' },
    { number: '+1234567892' },
    { number: '+1234567893' },
    { number: '+1234567894' },
  ];

  try {
    await db.insert(phoneNumbers).values(phoneNumbersToInsert);
    console.log('Phone numbers seeded successfully!');
  } catch (error) {
    console.error('Error seeding phone numbers:', error);
  } finally {
    await client.end();
  }
}

void seed();
