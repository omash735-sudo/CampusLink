// scripts/seed.ts
import { db } from '@/lib/db';
import { programmes, cohorts } from '@/lib/db/schema';

async function seed() {
  console.log(' Seeding database...');

  // Only seed programmes if table is empty
  const existingProgrammes = await db.select().from(programmes);

  if (existingProgrammes.length === 0) {
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
  } else {
    console.log(` Skipping programmes — ${existingProgrammes.length} already exist`);
  }

  // Only seed cohorts if none exist
  const existingCohorts = await db.select().from(cohorts);
  if (existingCohorts.length === 0) {
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
  } else {
    console.log(` Skipping cohorts — ${existingCohorts.length} already exist`);
  }

  console.log(' Seed complete!');
  console.log('');
  console.log(' NOTE: No admin account is created by this script.');
  console.log(' To create your admin account, visit: /admin/setup');
  console.log(' (Only works if no admin exists yet.)');
}

seed().catch(console.error);
