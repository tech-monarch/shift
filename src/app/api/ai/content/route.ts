import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { platform, task, tone } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    let prompt = `Generate a social media post for ${platform} about the following task: "${task}".`;

    if (tone) {
      prompt += ` Use a ${tone} tone.`;
    }

    if (platform === 'tiktok' || platform === 'instagram') {
      prompt += ` Write a short video script (30-45 seconds) with a hook, main content, and call to action. Include suggestions for visuals.`;
    } else if (platform === 'x') {
      prompt += ` Keep it under 280 characters. Include relevant hashtags.`;
    } else if (platform === 'linkedin') {
      prompt += ` Write a professional but engaging post, longer format, with hashtags.`;
    } else if (platform === 'devto' || platform === 'medium') {
      prompt += ` Write a full-length article (3-5 minute read) suitable for ${platform}. Include:
- A compelling title
- An engaging introduction
- 3-4 main sections with subheadings
- A conclusion with key takeaways
- Relevant tags (as a comma-separated list at the end)

Make it informative, well-structured, and ready to publish.`;
    }

    prompt += ` The content should be ready to copy and paste.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return Response.json({ content: response });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('AI Content error:', errorMessage);
    return Response.json(
      { error: 'Failed to generate content: ' + errorMessage },
      { status: 500 }
    );
  }
}