import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation"; // Import usePathname from next/navigation
import { Painting } from "../../types";
import useSavePainting from "../../hooks/useSavePainting"; // Import the hook
import useDeletePainting from "../../hooks/useDeletePainting"; // Import the delete hook
import { useEffect, useState } from "react";

interface PaintingCardProps {
  painting: Painting;
  sanitizeTitle: (title: string) => string;
  isSaved: boolean; // Indicates if the painting is already saved
}

export function PaintingCard({
  painting,
  sanitizeTitle,
  isSaved,
}: PaintingCardProps) {
  const pathname = usePathname(); // Get the current route path
  const router = useRouter();
  const isMyGalleryRoute = pathname === "/my-gallery"; // Check if we're on the /my-gallery route

  // Use the useSavePainting hook
  const { saveStatus, savePainting } = useSavePainting();
  // Use the useDeletePainting hook
  const { deleteStatus, deletePainting } = useDeletePainting();

  // State to track if the painting is saved locally
  const [isPaintingSaved, setIsPaintingSaved] = useState(isSaved);

  // Update local state if the `isSaved` prop changes
  useEffect(() => {
    setIsPaintingSaved(isSaved);
  }, [isSaved]);

  // Handle save button click
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the Link from navigating
    e.stopPropagation(); // Stop event bubbling

    // Do nothing if the painting is already saved
    if (isPaintingSaved) return;

    savePainting(
      painting,
      () => {
        console.log("Painting saved successfully!");
        setIsPaintingSaved(true); // Update local state to reflect the painting is saved
      },
      (error) => {
        console.error("Failed to save painting:", error);
      }
    );
  };

  // Handle delete button click
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the Link from navigating
    e.stopPropagation(); // Stop event bubbling

    deletePainting(
      painting,
      () => {
        console.log("Painting deleted successfully!");
        setIsPaintingSaved(false); // Update local state to reflect the painting is no longer saved
        router.refresh();
      },
      (error) => {
        console.error("Failed to delete painting:", error);
      }
    );
  };

  return (
    <Link
      href={`/painting/${sanitizeTitle(painting.title as string)}?contentId=${
        painting.contentId
      }`}
      className="block relative group" // Added group for hover effects
    >
      {/* Save/Delete button */}
      <button
        onClick={isMyGalleryRoute ? handleDelete : handleSave} // Use delete handler on /my-gallery, save handler otherwise
        className={`absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10 opacity-0 group-hover:opacity-100 ${
          isPaintingSaved && !isMyGalleryRoute
            ? "cursor-not-allowed"
            : "cursor-pointer"
        }`} // Disable pointer events if saved (except on /my-gallery)
        aria-label={
          isMyGalleryRoute
            ? "Delete painting"
            : isPaintingSaved
            ? "Painting already saved"
            : "Save painting"
        }
        disabled={
          isMyGalleryRoute
            ? deleteStatus.isLoading
            : saveStatus.isLoading || isPaintingSaved
        } // Disable button while saving/deleting or if already saved
      >
        {isMyGalleryRoute ? (
          // Delete icon (x)
          <svg
            className="w-4 h-4 text-red-500" // Red color for delete icon
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : saveStatus.isLoading ? (
          // Loading spinner
          <svg
            className="w-4 h-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          // Checkmark icon
          <svg
            className={`w-4 h-4 ${
              isPaintingSaved ? "text-green-500" : "text-current"
            }`} // Green checkmark if saved
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>

      {/* Painting content */}
      <div className="flex flex-col items-center justify-center p-4 border rounded-md shadow-md my-6 break-inside-avoid">
        <Image
          src={painting.image as string}
          alt={`Artwork: ${painting.title}`}
          height={painting.height}
          width={painting.width}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <p className="text-center mt-2 text-lg">
          {painting.title || "Untitled"}
        </p>
        <p className="text-center text-sm text-gray-500">
          {painting.artistName || "Unknown Artist"}
        </p>
      </div>
    </Link>
  );
}
