import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabase, getAuthenticatedClient } from "../../lib/supabaseClient";
import { Painting } from "@/app/types";

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "You are not authorized" },
      { status: 401 }
    );
  }

  try {
    const authenticatedSupabase = await getAuthenticatedClient(user.id);

    const { data: paintings, error: supabaseError } =
      await authenticatedSupabase
        .from("paintings")
        .select("*")
        .eq("user_id", user.id);

    if (supabaseError) {
      throw supabaseError;
    }

    return NextResponse.json({ gallery: paintings });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "You are not authorized" },
      { status: 401 }
    );
  }

  try {
    const { metadataValue } = await request.json();
    const authenticatedSupabase = await getAuthenticatedClient(user.id);

    // Check if the user exists in the database, or create them
    const { data: dbUser, error: userError } = await authenticatedSupabase
      .from("users")
      .select("*")
      .eq("clerk_id", user.id)
      .single();

    if (!dbUser) {
      const { data: newUser, error: newUserError } = await authenticatedSupabase
        .from("users")
        .insert([{ clerk_id: user.id }])
        .select()
        .single();

      if (newUserError) {
        throw newUserError;
      }
    }

    // Check for duplicate paintings
    const { data: duplicate, error: duplicateError } =
      await authenticatedSupabase
        .from("paintings")
        .select("*")
        .eq("title", metadataValue.title)
        .eq("user_id", user.id);

    if (duplicate && duplicate.length > 0) {
      return NextResponse.json(
        { error: "Painting already exists in your gallery" },
        { status: 400 }
      );
    }

    // Add the painting to the database
    const { data: painting, error: paintingError } = await authenticatedSupabase
      .from("paintings")
      .insert([
        {
          title: metadataValue.title,
          description: metadataValue.description,
          image_url: metadataValue.imageUrl,
          artist: metadataValue.artist,
          user_id: user.id,
        },
      ])
      .select();

    if (paintingError) {
      throw paintingError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "You are not authorized" },
      { status: 401 }
    );
  }

  try {
    const { title } = await request.json();
    const authenticatedSupabase = await getAuthenticatedClient(user.id);

    if (!title) {
      return NextResponse.json(
        { error: "Painting title is required" },
        { status: 400 }
      );
    }

    const { data, error: deleteError } = await authenticatedSupabase
      .from("paintings")
      .delete()
      .eq("title", title)
      .eq("user_id", user.id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
