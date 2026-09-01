import { db } from '../../db/index.js';
import { claims } from '../../db/schema.js';
import { detectConflict } from '../../server/ai/validation/conflict-detection.js';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  // Simple authentication for the webhook
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const body = await req.json();
    const { subject, predicate, objectValue, attribution, confidence } = body;

    if (!subject || !predicate || !objectValue) {
      return new Response(JSON.stringify({ error: 'Missing required claim fields' }), { status: 400 });
    }

    // Phase 3: Automatic Conflict Detection
    const conflictAnalysis = await detectConflict(subject, predicate, objectValue);

    const newClaim = {
      id: uuidv4(),
      subject,
      predicate,
      objectValue,
      confidence: confidence || 100,
      status: conflictAnalysis.hasConflict ? 'CONFLICTED' : 'VERIFIED',
    };

    // Cast status properly
    await db!.insert(claims).values({
      ...newClaim,
      status: newClaim.status as any,
    });

    return new Response(JSON.stringify({ 
      success: true, 
      claimId: newClaim.id,
      status: newClaim.status,
      conflictAnalysis 
    }), { status: 201 });

  } catch (error) {
    console.error('Webhook ingestion error:', error);
    return new Response(JSON.stringify({ error: 'Failed to ingest data' }), { status: 500 });
  }
}
