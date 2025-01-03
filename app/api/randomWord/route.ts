import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is set in the environment variables
});

// The GET function handles the GET request
export async function GET(request: NextRequest) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Give me a single random word. Try to make the words as varied as possible, with as much variety in subject matter as possible." },
      ],
    });

    const randomWord = response.choices[0]?.message?.content?.trim() || "defaultWord";

    // Respond with the random word as JSON
    return NextResponse.json({ word: randomWord });
  } catch (error) {
    console.error("Error fetching random word:", error);
    return NextResponse.json({ error: "Failed to fetch random word." }, { status: 500 });
  }
}
