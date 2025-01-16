import { useState } from "react";
import type { ArtistPainting, PaintingInformation } from "../types";

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

const useSavePainting = () => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(INITIAL_SAVE_STATUS);

  const savePainting = async (
    painting: PaintingInformation | ArtistPainting,
    onSaveSuccess?: () => void,
    onSaveError?: (error: string) => void
  ) => {
    setSaveStatus({ ...INITIAL_SAVE_STATUS, isLoading: true });

    try {
      const response = await fetch(`${process.env.API_URL}/api/userGallery`, {
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

  return { saveStatus, savePainting };
};

export default useSavePainting;
