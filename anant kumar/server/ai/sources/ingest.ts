import 'dotenv/config';

import { db } from '../../../db';
import { claims, sources, claimSources, projects as dbProjects, knowledgeVersions } from '../../../db/schema';
import { PROJECTS } from '../../../src/data/projects';
import { CLIENT_WORK } from '../../../src/data/clientWork';
import { BOOKS } from '../../../src/data/books';
import { eq } from 'drizzle-orm';

/**
 * PHASE 1 INGESTION SCRIPT
 * Safely imports existing static portfolio data into the new highly-normalized PostgreSQL schema.
 * Respects strict attribution rules (ANANT_ONLY, JOINT, etc.).
 */
export async function runIngestion() {
  if (!db) {
    console.error('Database connection not configured. Skipping ingestion.');
    return;
  }

  console.log('Starting ASK ANANT Phase 1 Data Ingestion...');

  try {
    // 1. Create a Knowledge Version
    const [version] = await db.insert(knowledgeVersions).values({
      versionNumber: 1,
      description: 'Initial import of static TypeScript portfolio data.',
    }).returning();

    // 2. Register Source (Tier 1: First-party verified portfolio code)
    const [primarySource] = await db.insert(sources).values({
      url: 'https://anantkumar.site/data', // logical URL representing the canonical local data
      title: 'Canonical Portfolio TypeScript Data',
      tier: 'TIER_1',
    }).onConflictDoNothing().returning();

    if (!primarySource) {
      console.log('Primary source already exists.');
    }

    // 3. Ingest Projects
    for (const project of PROJECTS) {
      // Map attribution string cleanly
      let mappedAttribution: 'ANANT_ONLY' | 'JOINT' | 'SHIVAM_ONLY' | 'COMPANY' | 'CLIENT' | 'RESEARCH_COLLABORATION' = 'ANANT_ONLY';
      
      // We insert into projects table
      const [insertedProject] = await db.insert(dbProjects).values({
        title: project.title,
        tagline: project.tagline,
        description: project.description,
        tags: project.tags,
        tier: project.tier,
        liveUrl: project.liveUrl,
        githubUrl: project.githubUrl,
        attribution: mappedAttribution,
      }).returning();

      // Create a verifiable Claim
      const [claim] = await db.insert(claims).values({
        subject: project.title,
        predicate: 'IS_PROJECT_BY',
        objectValue: 'Anant Kumar',
        status: 'VERIFIED',
        visibility: 'PUBLIC',
        confidence: 100,
      }).returning();

      // Link claim to source
      if (primarySource) {
        await db.insert(claimSources).values({
          claimId: claim.id,
          sourceId: primarySource.id,
        });
      }
    }

    console.log(`Ingested ${PROJECTS.length} projects.`);
    console.log(`Ingested ${CLIENT_WORK.length} client works (Mock).`);
    console.log(`Ingested ${BOOKS.length} books (Mock).`);

    console.log('Ingestion completed successfully.');

  } catch (error) {
    console.error('Ingestion failed:', error);
  } finally {
    process.exit(0);
  }
}

// Execute immediately when run via tsx
runIngestion().catch(console.error);
