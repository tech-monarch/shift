import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: Request) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set');
      return Response.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Build a single prompt with conversation history
    let prompt = '';
    for (const msg of messages) {
      prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
    }
    prompt += 'Assistant:';

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return Response.json({ response });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('AI Planner error:', errorMessage);
    return Response.json(
      { error: 'Failed to generate response: ' + errorMessage },
      { status: 500 }
    );
  }
}