import { db } from '../../../db';
import { claims } from '../../../db/schema';
import { sql, eq, and } from 'drizzle-orm';
import { primaryModel } from '../providers';
import { generateText } from 'ai';

/**
 * Validates a new claim against existing active claims for conflicts.
 * If a conflict is found, it can automatically flag the new claim for manual review.
 */
export async function detectConflict(subject: string, predicate: string, objectValue: string): Promise<{
  hasConflict: boolean;
  conflictingClaimId?: string;
  reason?: string;
}> {
  // Fetch existing claims about the same subject and predicate
  const existingClaims = await db!
    .select()
    .from(claims)
    .where(
      and(
        eq(claims.subject, subject),
        eq(claims.predicate, predicate),
        eq(claims.status, 'VERIFIED')
      )
    );

  if (existingClaims.length === 0) {
    return { hasConflict: false };
  }

  // Use LLM to determine if the new objectValue contradicts the existing ones
  const existingValues = existingClaims.map(c => c.objectValue).join(', ');
  
  const prompt = `
  Determine if the new claim contradicts the existing claims.
  Subject: ${subject}
  Predicate: ${predicate}
  Existing Values: ${existingValues}
  New Value: ${objectValue}
  
  Does the new value logically contradict the existing values? 
  For example, if predicate is 'is currently employed at', and the old value is 'Google' and new is 'Apple', it's a conflict.
  If the predicate is 'knows skill' and old is 'React' and new is 'Node.js', it is NOT a conflict (skills are additive).
  
  Respond with strictly JSON: { "conflict": boolean, "reason": "short explanation" }
  `;

  try {
    const response = await generateText({
      model: primaryModel,
      prompt,
      // Force JSON mode if supported by the provider, or parse manually
    });

    const result = JSON.parse(response.text);
    return {
      hasConflict: result.conflict,
      conflictingClaimId: result.conflict ? existingClaims[0].id : undefined,
      reason: result.reason,
    };
  } catch (error) {
    console.error('Error during conflict detection:', error);
    // Fail closed or open depending on security posture. Failing open for now:
    return { hasConflict: true, reason: 'Failed to analyze conflict automatically.' };
  }
}
