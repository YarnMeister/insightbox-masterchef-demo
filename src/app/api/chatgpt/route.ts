import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, comparisonData, country1, country2 } = body;

    console.log('🤖 ChatGPT API Route: Generating insights for', country1, 'vs', country2);

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable geography and economics expert. Provide factual, interesting insights about country comparisons. Use markdown formatting for structure."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || 'No response generated';

    console.log('✅ ChatGPT response generated successfully');

    return NextResponse.json({
      content,
      role: 'assistant'
    });

  } catch (error) {
    console.error('❌ ChatGPT API route error:', error);
    return NextResponse.json(
      { error: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 