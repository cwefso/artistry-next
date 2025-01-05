"use client";
import Link from "next/link";
import type { PaintingInformation } from "../../types";
import Image from "next/image";
import DeletePaintingButton from "./DeletePaintingButton";
import { SignedIn } from "@clerk/nextjs";
import SavePaintingButton from "./SavePaintingButton";

interface PaintingDetailsProps {
  painting: PaintingInformation | null;
}

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
}

const InfoRow = ({ label, value }: InfoRowProps) => {
  if (!value) return null;

  return (
    <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-700">
      <dt className="text-gray-400">{label}</dt>
      <dd className="col-span-2 text-white">{value}</dd>
    </div>
  );
};

const MarketInformation = ({ painting }: { painting: PaintingInformation }) => {
  if (!painting.auction && !painting.lastPrice && !painting.yearOfTrade) {
    return null;
  }

  return (
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
  );
};

export default function PaintingDetails({ painting }: PaintingDetailsProps) {
  if (!painting) {
    return (
      <div role="status" className="text-center py-8">
        Loading painting details...
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold mb-4 text-center text-white">
          {painting.title}
        </h1>
      </header>

      <figure className="relative w-full mb-8 flex justify-center">
        <Image
          src={painting.image}
          alt={`Artwork: ${painting.title}`}
          height={painting.height}
          width={painting.width}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </figure>

      <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Description</h2>
          <p className="text-gray-300">{painting.description}</p>
        </section>

        <section className="grid grid-cols-1 gap-4">
          <h2 className="text-xl font-semibold mb-2 text-white">Details</h2>
          <dl className="space-y-2">
            <InfoRow
              label="Artist"
              value={
                <Link
                  href={`/artist/${painting.artistUrl}`}
                  className="text-blue-400 hover:text-blue-300"
                >
                  {painting.artistName}
                </Link>
              }
            />
            <InfoRow label="Completion Year" value={painting.yearAsString} />
            <InfoRow label="Series" value={painting.serie} />
            <InfoRow label="Style" value={painting.style} />
            <InfoRow label="Genre" value={painting.genre} />
            <InfoRow label="Gallery" value={painting.galleryName} />
            {painting.sizeX ||
              (painting.sizeY && (
                <InfoRow
                  label="Dimensions"
                  value={`${painting.sizeX} × ${painting.sizeY} cm`}
                />
              ))}
            <InfoRow label="Material" value={painting.material} />
            <InfoRow label="Technique" value={painting.technique} />
            <InfoRow label="Period" value={painting.period} />
            <InfoRow label="Tags" value={painting.tags} />
          </dl>
        </section>

        <MarketInformation painting={painting} />
        <SignedIn>
          <SavePaintingButton
            painting={painting}
            onSaveSuccess={() => console.log("Saved successfully!")}
          />
          <DeletePaintingButton
            painting={painting}
            onDeleteSuccess={() => console.log("Deleted successfully")}
          />
        </SignedIn>
      </div>
    </article>
  );
}
