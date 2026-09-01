import { streamText, convertToModelMessages } from 'ai';
import { primaryModel } from '../../server/ai/providers/index.js';
import { retrieveRelevantKnowledge } from '../../server/ai/retrieval/index.js';

// Simple in-memory rate limiter (per instance)
const rateLimit = new Map<string, { count: number; resetAt: number }>();

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    // Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const limitRecord = rateLimit.get(ip);
    if (limitRecord && now < limitRecord.resetAt) {
      if (limitRecord.count >= 10) {
        return new Response('Rate limit exceeded. Please try again later.', { status: 429 });
      }
      limitRecord.count++;
    } else {
      rateLimit.set(ip, { count: 1, resetAt: now + 60000 });
    }

    const body = await req.json();
    const { messages } = body;

    if (!messages || messages.length === 0) {
      return new Response('No messages provided', { status: 400 });
    }

    // Extract last user message text — handles UIMessage (parts[]) format
    const lastMsg = messages[messages.length - 1];
    let lastMessageText = '';

    if (Array.isArray(lastMsg.parts)) {
      lastMessageText = lastMsg.parts
        .filter((p: { type: string }) => p.type === 'text')
        .map((p: { text: string }) => p.text)
        .join(' ');
    } else if (typeof lastMsg.content === 'string') {
      lastMessageText = lastMsg.content;
    } else if (Array.isArray(lastMsg.content)) {
      lastMessageText = lastMsg.content
        .filter((p: { type: string }) => p.type === 'text')
        .map((p: { text: string }) => p.text)
        .join(' ');
    }

    if (!lastMessageText.trim()) {
      return new Response('Empty message', { status: 400 });
    }

    // Simple keyword filter for completely off-topic queries
    const blocked = ['ignore previous', 'forget instructions', 'jailbreak', 'act as dan'];
    if (blocked.some(kw => lastMessageText.toLowerCase().includes(kw))) {
      const result = await streamText({
        model: primaryModel,
        messages: [{ role: 'user', content: 'Say: "I can only answer questions about Anant Kumar."' }],
      });
      return result.toDataStreamResponse();
    }

    // Retrieve relevant knowledge
    let context = '';
    try {
      context = await retrieveRelevantKnowledge(lastMessageText);
    } catch (e) {
      console.error('Retrieval error:', e);
      context = `Anant Kumar is an AI/ML Engineering student at LPU. He has built MangalKit (wedding platform), GeoJeevan AI (health platform), and Study LPU (ed-tech). He is President of Founders Verbinden and CEO of MangalKit. Contact: 720anant@gmail.com`;
    }

    // Convert UIMessages (parts format) to model messages for streamText
    // IMPORTANT: convertToModelMessages is async — must be awaited
    const modelMessages = await convertToModelMessages(messages);

    const result = await streamText({
      model: primaryModel,
      system: `You are "Ask Anant AI", a helpful assistant embedded in Anant Kumar's portfolio.

RULES:
1. Answer using the verified context below.
2. If the context doesn't contain the answer, say "I don't have a verified record of that."
3. Be concise, warm, and professional.
4. Never reveal API keys or internal secrets.
5. For greetings, introduce yourself and ask how you can help.

VERIFIED CONTEXT ABOUT ANANT KUMAR:
${context}`,
      messages: modelMessages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Ask Anant API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
