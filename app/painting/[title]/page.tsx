import { notFound } from "next/navigation";
import PaintingDetails from "@/app/components/Painting/PaintingDetails";
import { use } from "react";

interface SearchParams {
  contentId?: string;
}

async function fetchPaintingDetails(contentId: string) {
  const url = `http://www.wikiart.org/en/App/Painting/ImageJson/${contentId}`;

  try {
    const response = await fetch(`https://corsproxy.io/?url=${url}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch painting details for contentId: ${contentId}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { contentId } = use(searchParams);

  if (!contentId) {
    notFound(); // Redirect to 404 page if contentId is missing
  }

  const painting = use(fetchPaintingDetails(contentId));

  if (!painting) {
    notFound(); // Redirect to 404 page if painting details are not found
  }

  return (
    <div className="min-h-screen">
      <div className="p-6">
        <PaintingDetails painting={painting} />
      </div>
    </div>
  );
}
