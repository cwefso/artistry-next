import { NextResponse } from 'next/server';
import randomTerms from "../../randomTerms";

// The GET function handles the GET request
export async function GET() {
  try {
    // Select a random word from the randomTerms array
    const randomIndex = Math.floor(Math.random() * randomTerms.length);
    const randomWord = randomTerms[randomIndex];
    return NextResponse.json({ word: randomWord });
  } catch (error) {
    console.error("Error fetching random word:", error);
    return NextResponse.json({ error: "Failed to fetch random word." }, { status: 500 });
  }
}
