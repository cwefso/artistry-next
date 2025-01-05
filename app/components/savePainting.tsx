"use client";
import { useState } from "react";
import type { ArtistPainting, PaintingInformation } from "../types";
import LoadingSpinner from "./LoadingSpinner";

interface SavePaintingProps {
  painting: PaintingInformation | ArtistPainting;
  onSaveSuccess?: () => void;
  onSaveError?: (error: string) => void;
  className?: string;
  variant?: "primary" | "secondary" | "minimal";
}

interface SaveStatus {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const INITIAL_SAVE_STATUS: SaveStatus = {
  isLoading: false,
  error: null,
  success: false,
};

const VARIANT_STYLES = {
  primary: "bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg",
  secondary: "bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg",
  minimal: "text-blue-400 hover:text-blue-300 underline",
};

const SavePainting = ({
  painting,
  onSaveSuccess,
  onSaveError,
  className = "",
  variant = "primary",
}: SavePaintingProps) => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(INITIAL_SAVE_STATUS);

  const handleSave = async () => {
    setSaveStatus({ ...INITIAL_SAVE_STATUS, isLoading: true });

    try {
      const response = await fetch("/api/saveMetadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metadataValue: painting }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save painting");
      }

      setSaveStatus({ isLoading: false, error: null, success: true });
      onSaveSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setSaveStatus({
        isLoading: false,
        error: errorMessage,
        success: false,
      });
      onSaveError?.(errorMessage);
    }
  };

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

export default SavePainting;
