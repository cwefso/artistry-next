import { currentUser } from "@clerk/nextjs/server";
import { Painting } from "../types";
import GalleryLayout from "../components/Gallery/GalleryLayout";

export default async function MyGallery() {
  const user = await currentUser();

  if (!user) {
    return <div>You are not authorized to view this page.</div>;
  }

  try {
    const userMetadata = await user.privateMetadata;
    const gallery: Painting[] = Array.isArray(userMetadata?.gallery)
      ? userMetadata.gallery
      : [];

    return <GalleryLayout paintings={gallery} />;
  } catch (error) {
    console.error(error);
    return <div>Error loading gallery.</div>;
  }
}
