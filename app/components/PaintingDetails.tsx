import { PaintingInformation } from "../types";

interface PaintingDetailsProps {
  painting: PaintingInformation | null; // Allow null value
}

export default function PaintingDetails({ painting }: PaintingDetailsProps) {
  if (!painting) {
    return <div>Loading painting details...</div>;
  }

  const InfoRow = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) =>
    value ? (
      <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-700">
        <dt className="text-gray-400">{label}</dt>
        <dd className="col-span-2 text-white">{value}</dd>
      </div>
    ) : null;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center text-white">
        {painting.title}
      </h1>

      <div className="relative w-full mb-8 flex justify-center">
        <img
          src={painting.image}
          alt={painting.title}
          className="rounded-lg shadow-xl max-h-[70vh] w-auto object-contain"
        />
      </div>

      <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Description</h2>
          <p className="text-gray-300">{painting.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <h2 className="text-xl font-semibold mb-2 text-white">Details</h2>
          <dl className="space-y-2">
            <InfoRow
              label="Artist"
              value={
                <a
                  href={`/artist/${painting.artistUrl}`}
                  className="text-blue-400 hover:text-blue-300"
                >
                  {painting.artistName}
                </a>
              }
            />
            <InfoRow label="Completion Year" value={painting.yearAsString} />
            <InfoRow label="Series" value={painting.serie} />
            <InfoRow label="Style" value={painting.style} />
            <InfoRow label="Genre" value={painting.genre} />
            <InfoRow label="Gallery" value={painting.galleryName} />
            <InfoRow
              label="Dimensions"
              value={`${painting.sizeX} × ${painting.sizeY} cm`}
            />
            {painting.material && (
              <InfoRow label="Material" value={painting.material} />
            )}
            {painting.technique && (
              <InfoRow label="Technique" value={painting.technique} />
            )}
            {painting.period && (
              <InfoRow label="Period" value={painting.period} />
            )}
            <InfoRow label="Tags" value={painting.tags} />
          </dl>
        </div>

        {(painting.auction || painting.lastPrice || painting.yearOfTrade) && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2 text-white">
              Market Information
            </h2>
            <dl className="space-y-2">
              {painting.auction && (
                <InfoRow label="Auction" value={painting.auction} />
              )}
              {painting.lastPrice && (
                <InfoRow
                  label="Last Price"
                  value={`$${painting.lastPrice.toLocaleString()}`}
                />
              )}
              {painting.yearOfTrade && (
                <InfoRow label="Year of Trade" value={painting.yearOfTrade} />
              )}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
