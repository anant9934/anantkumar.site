import { db } from '../../../db';
import { claims } from '../../../db/schema';
import { sql } from 'drizzle-orm';

export async function retrieveRelevantKnowledge(query: string) {
  // Phase 2: Hybrid Retrieval (Currently fetching all ACTIVE claims since the dataset is small enough for the context window)
  // Phase 3 will introduce proper pgvector similarity search.
  const activeClaims = await db!
    .select()
    .from(claims)
    .where(sql`status = 'VERIFIED'`);

  // Format into a claim-based context string
  return activeClaims
    .map(c => `[CLAIM_${c.id}] ${c.subject} ${c.predicate} ${c.objectValue} (Confidence: ${c.confidence})`)
    .join('\n');
}
