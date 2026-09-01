import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { db } from '../db/index.js';
import { claims } from '../db/schema.js';
import { PROFILE, SOCIAL_LINKS } from '../src/data/constants.js';
import { PROJECTS } from '../src/data/projects.js';
import { eq } from 'drizzle-orm';

async function seed() {
  if (!db) {
    console.error("Database not connected. Please check DATABASE_URL in .env");
    process.exit(1);
  }
  
  console.log("Seeding verified claims to Neon DB...");

  const verifiedClaims: any[] = [
    {
      subject: PROFILE.name,
      predicate: 'is a',
      objectValue: PROFILE.title,
      status: 'VERIFIED' as const,
      visibility: 'PUBLIC' as const,
    },
    {
      subject: PROFILE.name,
      predicate: 'can be contacted at',
      objectValue: PROFILE.email,
      status: 'VERIFIED' as const,
      visibility: 'PUBLIC' as const,
    }
  ];

  // Add social links
  for (const link of SOCIAL_LINKS) {
    verifiedClaims.push({
      subject: PROFILE.name,
      predicate: `has a ${link.label} profile at`,
      objectValue: link.href,
      status: 'VERIFIED' as const,
      visibility: 'PUBLIC' as const,
    });
  }

  // Add projects
  for (const project of PROJECTS) {
    verifiedClaims.push({
      subject: PROFILE.name,
      predicate: 'built/developed',
      objectValue: project.title,
      status: 'VERIFIED' as const,
      visibility: 'PUBLIC' as const,
    });
    
    verifiedClaims.push({
      subject: project.title,
      predicate: 'is',
      objectValue: project.description || project.tagline || 'a project',
      status: 'VERIFIED' as const,
      visibility: 'PUBLIC' as const,
    });

    if (project.liveUrl) {
      verifiedClaims.push({
        subject: project.title,
        predicate: 'can be accessed at',
        objectValue: project.liveUrl,
        status: 'VERIFIED' as const,
        visibility: 'PUBLIC' as const,
      });
    }
  }

  // Clear existing claims to avoid duplicates during seeding
  console.log("Clearing existing claims...");
  await db.delete(claims);

  console.log(`Inserting ${verifiedClaims.length} verified claims...`);
  await db.insert(claims).values(verifiedClaims);
  
  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch(console.error);
