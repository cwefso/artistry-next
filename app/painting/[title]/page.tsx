import Image from "next/image";

export default function Page({
  params,
  searchParams,
}: {
  params: { title: string };
  searchParams: { [key: string]: string };
}) {
  const { title } = params;
  const { artistName, image, width, height } = searchParams;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">
        Painting: {title.replace(/-/g, " ")}
      </h1>
      <p className="text-lg mb-2">Artist: {artistName || "Unknown Artist"}</p>
      <Image
        src={image}
        alt={title.replace(/-/g, " ")}
        width={parseInt(width, 10) || 300}
        height={parseInt(height, 10) || 300}
        className="rounded-md shadow-lg"
      />
    </div>
  );
}
