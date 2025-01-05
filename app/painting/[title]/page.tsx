"use client";
import { useRouter, useSearchParams } from "next/navigation";
import PaintingDetails from "@/app/components/PaintingDetails";
import usePaintingSummary from "@/app/hooks/usePaintingSummary";
import { PaintingInformation } from "@/app/types";

export default function Page({ params }: { params: { title: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentId = searchParams.get("contentId");

  // You might want to add error handling if contentId is null
  if (!contentId) {
    return <div>Error: No content ID provided</div>;
  }

  const painting = usePaintingSummary(contentId);

  console.log("painting for summary", painting);

  const handleRefresh = () => {
    router.push("/"); // Navigate back to home page for a new random painting
  };

  const handleSave = async () => {
    // Since we're on the details page, we might want to handle this differently
    // For now, we'll just return to avoid duplicate saves
    return Promise.resolve();
  };

  const handleDelete = async () => {
    // Your existing delete logic...
    return Promise.resolve();
  };

  return (
    <div className="min-h-screen">
      <div className="p-6">
        <button
          onClick={() => router.back()}
          className="mb-6 border border-white text-white py-2 px-4 rounded-md hover:bg-white hover:text-black transition-colors"
        >
          Back
        </button>

        <PaintingDetails painting={painting} />
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleDelete}
            className="border border-red-500 text-red-500 py-2 px-4 rounded-md hover:bg-red-500 hover:text-white transition-colors"
          >
            Delete from Gallery
          </button>
        </div>
      </div>
    </div>
  );
}
