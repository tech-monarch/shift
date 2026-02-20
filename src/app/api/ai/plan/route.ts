import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: Request) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); // or 'gemini-2.0-flash'

    // Format history for Gemini
    const history = messages.slice(0, -1).map((m: Message) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });
    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response.text();

    return Response.json({ response });
  } catch (error) {
    console.error('AI Planner error:', error);
    return Response.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}