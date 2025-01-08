import { notFound } from "next/navigation";
import PaintingDetails from "@/app/components/Painting/PaintingDetails";

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

export default async function Page({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const contentId = searchParams?.contentId;

  if (!contentId) {
    notFound(); // Redirects to 404 page if contentId is missing
  }

  const painting = await fetchPaintingDetails(contentId);

  if (!painting) {
    notFound(); // Redirects to 404 page if painting details are not found
  }

  return (
    <div className="min-h-screen">
      <div className="p-6">
        <PaintingDetails painting={painting} />
      </div>
    </div>
  );
}
