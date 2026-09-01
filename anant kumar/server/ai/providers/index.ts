import { createOpenRouter } from '@openrouter/ai-sdk-provider';

// Standard OpenRouter setup
export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY_1 || process.env.OPENROUTER_API_KEY_2,
});

// Primary model for the deterministic engine
export const primaryModel = openrouter('meta-llama/llama-3.1-70b-instruct');
