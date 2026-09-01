import { streamText } from 'ai';
import { primaryModel } from '../../server/ai/providers/index.js';
import { retrieveRelevantKnowledge } from '../../server/ai/retrieval/index.js';
import { checkRelevance } from '../../server/ai/safety/firewall.js';

// Vercel Serverless Function Config
export const maxDuration = 30;

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // 1. Relevance Firewall
    if (!checkRelevance(lastMessage)) {
      return new Response(JSON.stringify({ 
        error: "I am Ask Anant AI. I can only answer questions related to Anant Kumar's professional experience, projects, and background." 
      }), { status: 400 });
    }

    // 2. Hybrid Retrieval (Phase 2: Full context injection)
    const context = await retrieveRelevantKnowledge(lastMessage);

    // 3. Deterministic Answer Engine Generation
    const result = await streamText({
      model: primaryModel,
      system: `You are 'Ask Anant AI', a strict deterministic answering engine embedded in Anant Kumar's portfolio.
      
      CORE RULES:
      1. You must ONLY answer based on the following verified claims.
      2. If the answer is not explicitly in the claims, you MUST reply: "I don't have a verified record of that."
      3. Never infer ownership or exaggerate claims.
      4. Keep your answers concise, professional, and directly address the user's question.
      5. Adopt a helpful, slightly brutalist but friendly tone.
      
      VERIFIED CLAIMS CONTEXT:
      ${context}
      `,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Ask Anant API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process request.' }), { status: 500 });
  }
}
