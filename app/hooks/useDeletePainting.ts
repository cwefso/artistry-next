import { useState } from "react";
import type { ArtistPainting, PaintingInformation } from "../types";

interface DeleteStatus {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const INITIAL_DELETE_STATUS: DeleteStatus = {
  isLoading: false,
  error: null,
  success: false,
};

const useDeletePainting = () => {
  const [deleteStatus, setDeleteStatus] = useState<DeleteStatus>(
    INITIAL_DELETE_STATUS
  );

  const deletePainting = async (
    painting: PaintingInformation | ArtistPainting,
    onDeleteSuccess?: () => void,
    onDeleteError?: (error: string) => void
  ) => {
    setDeleteStatus({ ...INITIAL_DELETE_STATUS, isLoading: true });

    try {
      const response = await fetch(`${process.env.API_URL}/api/userGallery`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: painting.title }), // Assuming `title` is the unique identifier for the painting
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete painting");
      }

      setDeleteStatus({ isLoading: false, error: null, success: true });
      onDeleteSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setDeleteStatus({
        isLoading: false,
        error: errorMessage,
        success: false,
      });
      onDeleteError?.(errorMessage);
    }
  };

  return { deleteStatus, deletePainting };
};

export default useDeletePainting;
