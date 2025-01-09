import { NextResponse } from 'next/server';
import { currentUser, clerkClient } from '@clerk/nextjs/server';
import { Painting } from '@/app/types';
import { error } from 'console';

export async function GET() {
  // Get the current logged-in Clerk user
  const user = await currentUser();
  console.log("user", user)
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
    console.log(error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}


export async function POST(request: Request) {
    // Get the current logged-in Clerk user
    const user = await currentUser();
  
    if (!user) {
      return NextResponse.json(
        { error: error },
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
          { error: error },
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
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "An unexpected error occurred", },
        { status: 500 },
      );
    }
  }
  
  export async function DELETE(request: Request) {
    // Get the current logged-in Clerk user
    const user = await currentUser();
  
    if (!user) {
      return NextResponse.json(
        { error: 'You are not authorized' },
        { status: 401 },
      );
    }
  
    try {
      // Parse the request body to get the painting title to remove
      const { title } = await request.json();
  
      if (!title) {
        return NextResponse.json(
          { error: 'Painting title is required' },
          { status: 400 },
        );
      }
  
      // Create a clerk instance
      const clerk = await clerkClient();
  
      // Fetch current user metadata
      const userMetadata = await user.privateMetadata;
  
      // Ensure gallery is initialized as an array
      const gallery = Array.isArray(userMetadata?.gallery) ? userMetadata?.gallery : [];
  
      // Find the painting in the gallery
      const paintingExists = gallery.some((painting: Painting) => painting.title === title);
  
      if (!paintingExists) {
        return NextResponse.json(
          { error: 'Painting not found in your gallery' },
          { status: 404 },
        );
      }
  
      // Filter out the painting to remove
      const updatedGallery = gallery.filter(
        (painting: Painting) => painting.title !== title
      );
  
      // Update the user metadata with the filtered gallery array
      await clerk.users.updateUserMetadata(user.id!, {
        privateMetadata: {
          gallery: updatedGallery,
        },
      });
  
      // Return a success response
      return NextResponse.json({ success: true });
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "An unexpected error occurred", },
        { status: 500 },
      );
    }
  }