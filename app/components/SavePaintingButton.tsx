"use client";
import type { ArtistPainting, PaintingInformation } from "../types";
import useSavePainting from "../hooks/useSavePainting";
import LoadingSpinner from "./LoadingSpinner";

interface SavePaintingProps {
  painting: PaintingInformation | ArtistPainting;
  onSaveSuccess?: () => void;
  onSaveError?: (error: string) => void;
  className?: string;
  variant?: "primary" | "secondary" | "minimal";
}

const VARIANT_STYLES = {
  primary: "bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg",
  secondary: "bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg",
  minimal: "text-blue-400 hover:text-blue-300 underline",
};

const SavePaintingButton = ({
  painting,
  onSaveSuccess,
  onSaveError,
  className = "",
  variant = "primary",
}: SavePaintingProps) => {
  const { saveStatus, savePainting } = useSavePainting();

  const handleSave = () => savePainting(painting, onSaveSuccess, onSaveError);

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <button
        onClick={handleSave}
        disabled={saveStatus.isLoading}
        className={`
          ${VARIANT_STYLES[variant]}
          ${saveStatus.isLoading ? "opacity-50 cursor-not-allowed" : ""}
          transition-colors duration-200
        `}
        aria-busy={saveStatus.isLoading}
      >
        <span className="flex items-center gap-2">
          {saveStatus.isLoading ? (
            <>
              <LoadingSpinner />
              Saving...
            </>
          ) : (
            "Save to Gallery"
          )}
        </span>
      </button>

      {saveStatus.success && (
        <p className="mt-2 text-sm text-green-500" role="status">
          Painting saved!
        </p>
      )}
      {saveStatus.error && (
        <p className="mt-2 text-sm text-red-500" role="alert">
          {saveStatus.error}
        </p>
      )}
    </div>
  );
};

export default SavePaintingButton;
