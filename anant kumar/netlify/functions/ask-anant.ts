import { streamText, convertToModelMessages } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { retrieveRelevantKnowledge } from '../../server/ai/retrieval/index.js';

const API_KEY =
  process.env.OPENROUTER_API_KEY_1 ||
  process.env.OPENROUTER_API_KEY_2 ||
  process.env.OPENROUTER_API_KEY ||
  '';

const openrouter = createOpenRouter({ apiKey: API_KEY });
const primaryModel = openrouter('meta-llama/llama-3.1-70b-instruct');
const fallbackModel = openrouter('meta-llama/llama-3.1-8b-instruct');

// Simple in-memory rate limiter per edge/lambda instance
const rateLimit = new Map<string, { count: number; resetAt: number }>();

const STATIC_KNOWLEDGE = `
ANANT KUMAR — COMPREHENSIVE KNOWLEDGE BASE:

PROFILE:
- Name: Anant Kumar
- Role: AI/ML Engineer, Founder & Researcher
- Education: Computer Science Engineering (AI/ML specialization) at Lovely Professional University (LPU), India.
- Email: 720anant@gmail.com
- Phone: +91 7209536120
- GitHub: https://github.com/anant9934
- LinkedIn: https://www.linkedin.com/in/quantumanant01
- Blog: https://vadiccure.blogspot.com/
- Portfolio: https://anantkumar.site

KEY ACHIEVEMENTS & METRICS:
- Cumulative Revenue: ₹6 Lakh+ ($7,200+) generated through entrepreneurial ventures.
- Impact: 300+ active students reached via the Study LPU platform.
- Author: Author of "The AI Student" and co-author of "The Rhythm Code".
- Research & Patents:
  - Co-inventor/applicant on "DBMS Predictive Execution" patent (database query predictive branch optimization).
  - Published 1 technical paper review and research manuscripts in physics/AI.
  - Shortlisted for India Accelerator OpenXAI 2025 program.

WORK EXPERIENCE & LEADERSHIP:
1. President & CEO — Founders Verbinden [Aug 2025 – Present]
   - Strategic direction, operations, and growth of a founder-focused startup ecosystem connecting mentors, founders, and students.
2. Chief Executive Officer — Study LPU [Feb 2026 – Present]
   - Built an education platform with structured academic resources, interactive assessment, and mentorship. Reached 300+ students.
3. Lead Product Developer — GeoJeevan AI [Mar 2026 – Present]
   - Location-aware preventive-health platform turning environmental & city-level intelligence into actionable health precautions.
4. Campus Ambassador & Official Partner — Physics Wallah (PW) [Aug 2025 – Present]
   - Student outreach and learning opportunities advocacy.
5. Brand Ambassador — LaunchED Global [Aug 2025 – Present]
   - University representative promoting internship and career programs.
6. Member — Reddit Tech Enterprises [Aug 2025 – Jun 2026]
   - Hackathon workflows, competitive programming (ISRO challenges, Robo Wars).
7. Volunteer — LPU-NSS [Aug 2025 – Mar 2026]
   - Blood donation, cleanliness campaigns, tree plantations.

NOTABLE PROJECTS:
1. MANGALKIT (Flagship) — Modern spiritual-commerce platform for authentic devotional and puja products (Next.js, E-commerce). (https://www.mangalkit.com/)
2. QUICKDORM (Flagship) — Hyperlocal student commerce & hostel delivery platform (Next.js, TypeScript, PostgreSQL). (https://www.quickdorm.in/)
3. STUDY LPU — EdTech learning companion for university students with quizzes and notes. (https://studylpu.online/)
4. GYANMATRIX — AI career-trajectory intelligence converting professional milestones into structured reasoning and mentorship. (https://gyanmatrix.vercel.app/)
5. GEOJEEVAN AI — Geospatial preventive healthcare platform using environmental hazard data. (https://geojeevanai.online/)
6. DBMS PREDICTIVE EXECUTION — Database research on structural query hashing and speculative branch execution. (https://dbms-patent-code.vercel.app/)
7. SELF-SURVEILLANCE ROBOT — AI robotics prototype with ESP32-CAM, YOLOv8 object detection, and real-time telemetry dashboard.
8. ECOVULNAI — Ecological-risk screening framework using AHP methodology for environmental impact assessments.
9. GIFTMATTE AI — Recommendation engine solving generic gifting with live preview customization.
10. ACOS — Autonomous Context Operating System, a local-first LLM intelligence layer.
11. QUANTUM TUNNELING SIMULATOR — Solves Schrödinger equation for electron tunneling probabilities.

CERTIFICATIONS:
- Python (Basic) — HackerRank
- Drone Developer Certification Programme — Reliance Foundation
- Leadership and Management Skills — Reliance Foundation
- Leadership and Teams (P03V226) — Taylor University
- Time Management (MA) — Macmillan Education
- Hands-on Bootcamp on Artificial Intelligence — MachineHack
- Introduction to Generative AI Studio — Simplilearn
- AI for Beginners — Simplilearn
- Global Powered Data Analytics Job Simulation — Tata Group (Forage)
- Times Critical Thinking Championship — Times of India
- Hack India 2025 Participant — MachineHack
`;

export default async function handler(req: Request) {
  // Allow OPTIONS for CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-vercel-ai-ui-message-stream',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    // 0. Rate limiting (15 requests per minute per IP)
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const limitRecord = rateLimit.get(ip);
    if (limitRecord && now < limitRecord.resetAt) {
      if (limitRecord.count >= 15) {
        return new Response('Rate limit reached. Please wait a minute before asking more questions.', {
          status: 429,
        });
      }
      limitRecord.count++;
    } else {
      rateLimit.set(ip, { count: 1, resetAt: now + 60000 });
    }

    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response('No messages provided', { status: 400 });
    }

    // Extract query text from latest message
    const lastMsg = messages[messages.length - 1];
    let queryText = '';

    if (Array.isArray(lastMsg.parts)) {
      queryText = lastMsg.parts
        .filter((p: { type: string; text?: string }) => p.type === 'text')
        .map((p: { text?: string }) => p.text || '')
        .join(' ');
    } else if (typeof lastMsg.content === 'string') {
      queryText = lastMsg.content;
    } else if (Array.isArray(lastMsg.content)) {
      queryText = lastMsg.content
        .filter((p: { type: string; text?: string }) => p.type === 'text')
        .map((p: { text?: string }) => p.text || '')
        .join(' ');
    }

    if (!queryText.trim()) {
      return new Response('Empty message text', { status: 400 });
    }

    // Dynamic database context lookup (if Neon is reachable)
    let dynamicContext = '';
    try {
      dynamicContext = await retrieveRelevantKnowledge(queryText);
    } catch {
      dynamicContext = '';
    }

    const combinedContext = `${STATIC_KNOWLEDGE}\n\nDATABASE CLAIMS:\n${dynamicContext}`;

    // Convert UI messages to model messages (must be awaited in AI SDK v6)
    const modelMessages = await convertToModelMessages(messages);

    const systemPrompt = `You are "Ask Anant AI", an intelligent, friendly, and knowledgeable AI assistant embedded directly into Anant Kumar's official portfolio website (anantkumar.site).

PERSONALITY & GUIDELINES:
1. You represent Anant Kumar with precision, warmth, and confidence.
2. Answer questions about Anant's projects, technical skills (AI/ML, Python, React, Next.js, Robotics, C++), experience, education (LPU), startups (MangalKit, Study LPU, GeoJeevan AI, Founders Verbinden), publications, and contact info.
3. Be concise and conversational (1-3 short paragraphs max unless detailed lists are requested).
4. Use clean formatting with bullet points when listing projects or skills.
5. If someone greets you (e.g. "hi", "hello", "who are you"), warmly welcome them, introduce yourself as Anant's AI assistant, and invite them to ask anything about Anant's work, experience, or projects.
6. If asked for contact info or hiring, provide his email (720anant@gmail.com) and LinkedIn.
7. If asked something completely unrelated to Anant or technology, politely guide the conversation back to Anant's work.

KNOWLEDGE BASE:
${combinedContext}
`;

    try {
      const result = await streamText({
        model: primaryModel,
        system: systemPrompt,
        messages: modelMessages,
        temperature: 0.7,
      });

      return result.toUIMessageStreamResponse();
    } catch (primaryErr) {
      console.warn('Primary model failed, falling back to 8B:', primaryErr);
      const fallbackResult = await streamText({
        model: fallbackModel,
        system: systemPrompt,
        messages: modelMessages,
        temperature: 0.7,
      });

      return fallbackResult.toUIMessageStreamResponse();
    }
  } catch (error) {
    console.error('Ask Anant API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Sorry, I ran into an issue answering that. Please try again!' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
