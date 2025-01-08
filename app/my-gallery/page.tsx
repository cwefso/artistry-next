import GalleryLayout from "../components/Gallery/GalleryLayout";

async function getGallery() {
  // This runs on the server
  const response = await fetch(`${process.env.API_URL}/api/userGallery`, {
    cache: "no-store", // or use revalidate if you want
  });

  if (!response.ok) {
    throw new Error("Failed to fetch gallery");
  }

  return response.json();
}

export default async function MyGallery() {
  const initialData = await getGallery();

  return (
    <main>
      <section className="header w-full flex flex-row justify-between">
        <h1 className="page-title">My Gallery</h1>
      </section>

      <GalleryLayout paintings={initialData} />
    </main>
  );
}
