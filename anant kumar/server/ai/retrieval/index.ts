import { db } from '../../../db';
import { claims } from '../../../db/schema';
import { sql } from 'drizzle-orm';

export async function retrieveRelevantKnowledge(query: string) {
  // Phase 3: Hybrid Retrieval (Exact metadata filtering to prevent context bloat)
  const activeClaims = await db!
    .select()
    .from(claims)
    .where(sql`status = 'VERIFIED'`);

  // Simple, fast client-side keyword extraction/scoring to simulate vector similarity
  // without the latency and cost of an embedding API for small datasets.
  const queryWords = query.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  
  // If query is generic, return core profile claims
  if (queryWords.length === 0) {
    return activeClaims.slice(0, 10).map(c => `[CLAIM_${c.id}] ${c.subject} ${c.predicate} ${c.objectValue}`).join('\n');
  }

  // Score claims based on keyword matches
  const scoredClaims = activeClaims.map(claim => {
    const claimText = `${claim.subject} ${claim.predicate} ${claim.objectValue}`.toLowerCase();
    let score = 0;
    for (const word of queryWords) {
      if (claimText.includes(word)) score += 1;
    }
    return { claim, score };
  });

  // Sort by score and take top 15 most relevant claims + any profile claims (score >= 0)
  const relevantClaims = scoredClaims
    .sort((a, b) => b.score - a.score)
    .slice(0, 15)
    .map(c => c.claim);

  // Format into a claim-based context string
  return relevantClaims
    .map(c => `[CLAIM_${c.id}] ${c.subject} ${c.predicate} ${c.objectValue}`)
    .join('\n');
}
