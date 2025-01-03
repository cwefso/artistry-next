import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is set in the environment variables
});

// The GET function handles the GET request
export async function GET(request: NextRequest) {
  try {
    // Retrieve the list of banned words from the request headers
    const bannedWordsHeader = request.headers.get('X-Banned-Words');
    const bannedWords = bannedWordsHeader ? JSON.parse(bannedWordsHeader) : [];

    let randomWord = '';
    let attemptCount = 0;

    // Ensure we try to get a word that is not in the banned words list
    while (attemptCount < 5) {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
            role: "user",
            content: `Return a single, truly random word. The word can come from any part of speech (noun, verb, adjective, etc.) and any category (science, literature, everyday life, etc.). Avoid repeating previously generated words. Avoid the following banned words: ${bannedWords.join(', ')}.`,
          },
        ],
      });

      randomWord = response.choices[0]?.message?.content?.trim() || '';

      // If the word is valid and not in the banned list, break out of the loop
      if (randomWord && !bannedWords.includes(randomWord)) {
        break;
      }

      attemptCount++;
    }

    if (!randomWord) {
      return NextResponse.json({ error: "Unable to generate a unique word." }, { status: 500 });
    }

    return NextResponse.json({ word: randomWord });
  } catch (error) {
    console.error("Error fetching random word:", error);
    return NextResponse.json({ error: "Failed to fetch random word." }, { status: 500 });
  }
}
