import { NextResponse } from 'next/server';
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { Painting } from '@/app/types';

export async function POST(request: Request) {
  // Get the current logged-in Clerk user
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: 'You are not authorized' },
      { status: 401 },
    );
  }

  try {
    // Parse the request body to get the metadataKey and metadataValue (entire painting object)
    const { metadataValue } = await request.json();

    // Create a clerk instance
    const clerk = await clerkClient();

    // Fetch current user metadata
    const userMetadata = await user.privateMetadata;

    // Ensure gallery is initialized as an array (if it's missing or is an object)
    const gallery = Array.isArray(userMetadata?.gallery) ? userMetadata?.gallery : [];

    // Check if the painting already exists in the gallery by comparing the title or another unique property
    const isDuplicate = gallery.some(
      (painting: Painting) => painting.title === metadataValue.title // Or use another unique identifier
    );

    if (isDuplicate) {
      return NextResponse.json(
        { error: 'This painting is already in your gallery' },
        { status: 400 },
      );
    }

    // Update the user metadata with the updated gallery array (without duplicates)
    await clerk.users.updateUserMetadata(user.id!, {
      privateMetadata: {
        gallery: [...gallery, metadataValue],
         // Store the updated gallery array
      },
    });

    // Return a success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
