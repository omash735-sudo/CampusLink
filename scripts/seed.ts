// scripts/seed.ts
import { db } from '@/lib/db';
import { programmes, cohorts, users } from '@/lib/db/schema';
import { hashPassword } from '@/lib/auth';

async function seed() {
  console.log(' Seeding database...');

  // Seed Programmes
  const programmesData = [
    { name: 'BSc Agricultural Economics', slug: 'bsc-agricultural-economics', code: 'AGEC', faculty: 'Agriculture', department: 'Agricultural Economics', campus: 'LUANAR City Campus' },
    { name: 'BSc Animal Science', slug: 'bsc-animal-science', code: 'ANS', faculty: 'Agriculture', department: 'Animal Science', campus: 'LUANAR City Campus' },
    { name: 'BSc Food Science & Technology', slug: 'bsc-food-science-technology', code: 'FST', faculty: 'Agriculture', department: 'Food Science', campus: 'LUANAR City Campus' },
    { name: 'BSc Social Work & Youth Development', slug: 'bsc-social-work-youth-development', code: 'SWYD', faculty: 'Social Sciences', department: 'Social Work', campus: 'LUANAR City Campus' },
    { name: 'BSc Environmental Science', slug: 'bsc-environmental-science', code: 'ES', faculty: 'Natural Sciences', department: 'Environmental Science', campus: 'LUANAR City Campus' },
    { name: 'BSc Engineering', slug: 'bsc-engineering', code: 'ENG', faculty: 'Engineering', department: 'Engineering', campus: 'LUANAR City Campus' },
  ];

  for (const prog of programmesData) {
    await db.insert(programmes).values(prog).onConflictDoNothing();
  }

  console.log(' Programmes seeded');

  // Seed Cohorts
  const allProgrammes = await db.select().from(programmes);
  for (const prog of allProgrammes) {
    for (let year = 1; year <= 4; year++) {
      const studentCount = year === 1 ? 37 : year === 2 ? 29 : year === 3 ? 24 : 21;
      await db.insert(cohorts).values({
        programmeId: prog.id,
        year,
        academicYear: '2024/2025',
        studentCount,
      }).onConflictDoNothing();
    }
  }

  console.log(' Cohorts seeded');

  // Create Admin User
  const adminPassword = await hashPassword('admin123');
  await db.insert(users).values({
    email: 'admin@campuslink.com',
    passwordHash: adminPassword,
    fullName: 'System Administrator',
    username: 'admin',
    role: 'admin',
    isVerified: true,
  }).onConflictDoNothing();

  console.log(' Admin user created (email: admin@campuslink.com, password: admin123)');

  console.log(' Seed complete!');
}

seed().catch(console.error);
