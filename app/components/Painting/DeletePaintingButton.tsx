"use client";
import type { ArtistPainting, PaintingInformation } from "../../types";
import useDeletePainting from "../../hooks/useDeletePainting";
import LoadingSpinner from "../LoadingSpinner";

interface DeletePaintingProps {
  painting: PaintingInformation | ArtistPainting;
  onDeleteSuccess?: () => void;
  onDeleteError?: (error: string) => void;
  className?: string;
  variant?: "primary" | "secondary" | "minimal";
}

const VARIANT_STYLES = {
  primary: "bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg",
  secondary: "bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg",
  minimal: "text-red-400 hover:text-red-300 underline",
};

const DeletePaintingButton = ({
  painting,
  onDeleteSuccess,
  onDeleteError,
  className = "",
  variant = "primary",
}: DeletePaintingProps) => {
  const { deleteStatus, deletePainting } = useDeletePainting();

  const handleDelete = () => {
    deletePainting(painting, {
      onSuccess: onDeleteSuccess,
      onError: (error) => onDeleteError?.(error.message),
    });
  };

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <button
        onClick={handleDelete}
        disabled={deleteStatus.isLoading}
        className={`
          ${VARIANT_STYLES[variant]}
          ${deleteStatus.isLoading ? "opacity-50 cursor-not-allowed" : ""}
          transition-colors duration-200
        `}
        aria-busy={deleteStatus.isLoading}
      >
        <span className="flex items-center gap-2">
          {deleteStatus.isLoading ? (
            <>
              <LoadingSpinner />
              Deleting...
            </>
          ) : (
            "Delete from Gallery"
          )}
        </span>
      </button>

      {deleteStatus.success && (
        <p className="mt-2 text-sm text-green-500" role="status">
          Painting deleted!
        </p>
      )}
      {deleteStatus.error && (
        <p className="mt-2 text-sm text-red-500" role="alert">
          {deleteStatus.error}
        </p>
      )}
    </div>
  );
};

export default DeletePaintingButton;
