import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { Painting } from '@/app/types';

export async function GET() {
  // Get the current logged-in Clerk user
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: 'You are not authorized' },
      { status: 401 },
    );
  }

  try {
    // Fetch current user metadata
    const userMetadata = await user.privateMetadata;

    // Ensure gallery is initialized as an array (if it's missing or is an object)
    const gallery: Painting[] = Array.isArray(userMetadata?.gallery) 
      ? userMetadata.gallery 
      : [];

    // Return the gallery array
    return NextResponse.json({ gallery });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}