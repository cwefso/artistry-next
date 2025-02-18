import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Painting } from "../../types";
import useSavePainting from "../../hooks/useSavePainting";
import useDeletePainting from "../../hooks/useDeletePainting";
import { useEffect, useState } from "react";
import { SignedIn } from "@clerk/nextjs";

interface PaintingCardProps {
  painting: Painting;
  sanitizeTitle: (title: string) => string;
  isSaved: boolean;
}

export function PaintingCard({
  painting,
  sanitizeTitle,
  isSaved,
}: PaintingCardProps) {
  const pathname = usePathname();
  const isMyGalleryRoute = pathname === "/my-gallery";

  const { saveStatus, savePainting } = useSavePainting();
  const { deleteStatus, deletePainting } = useDeletePainting();
  const [isPaintingSaved, setIsPaintingSaved] = useState(isSaved);

  useEffect(() => {
    setIsPaintingSaved(isSaved);
  }, [isSaved]);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPaintingSaved) {
      console.log("Painting is already saved");
      return;
    }

    savePainting(painting, {
      onSuccess: () => {
        console.log("Painting saved successfully!");
        setIsPaintingSaved(true);
      },
      onError: (error) => {
        console.error("Failed to save painting:", error.message);
        setIsPaintingSaved(false);
      },
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    deletePainting(painting, {
      onSuccess: () => {
        console.log("Painting deleted successfully!");
        setIsPaintingSaved(false);
      },
      onError: (error) => {
        console.error("Failed to delete painting:", error.message);
      },
    });
  };

  return (
    <Link
      href={`/painting/${sanitizeTitle(painting.title as string)}?contentId=${
        painting.contentId
      }`}
      className="block relative group"
    >
      <SignedIn>
        <button
          onClick={isMyGalleryRoute ? handleDelete : handleSave}
          className={`absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10 opacity-0 group-hover:opacity-100 ${
            isPaintingSaved && !isMyGalleryRoute
              ? "cursor-not-allowed"
              : "cursor-pointer"
          }`}
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
          }
        >
          {isMyGalleryRoute ? (
            /* Delete icon */
            <svg
              className="w-4 h-4 text-red-500"
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
            /* Loading spinner */
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            /* Checkmark icon */
            <svg
              className={`w-4 h-4 ${
                isPaintingSaved ? "text-green-500" : "text-current"
              }`}
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
      </SignedIn>

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
