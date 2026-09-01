import { recordFeedback } from '../../server/ai/evaluation/feedback.js';

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  try {
    const body = await req.json();
    const { query, response, isPositive, comments } = body;

    if (!query || !response || typeof isPositive !== 'boolean') {
      return new Response(JSON.stringify({ error: 'Invalid feedback data' }), { status: 400 });
    }

    await recordFeedback(query, response, isPositive, comments);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Feedback recording error:', error);
    return new Response(JSON.stringify({ error: 'Failed to record feedback' }), { status: 500 });
  }
}
