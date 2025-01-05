"use client";
import { useRouter, useSearchParams } from "next/navigation";
import PaintingDetails from "@/app/components/PaintingDetails";
import usePaintingSummary from "@/app/hooks/usePaintingSummary";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentId = searchParams.get("contentId");

  // Always call the hook, and handle the error within the component render.
  const painting = usePaintingSummary(contentId);

  // If no contentId, show an error message.
  if (!contentId) {
    return <div>Error: No content ID provided</div>;
  }

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
          <button className="border border-red-500 text-red-500 py-2 px-4 rounded-md hover:bg-red-500 hover:text-white transition-colors">
            Delete from Gallery
          </button>
        </div>
      </div>
    </div>
  );
}
