export interface Painting {
    contentId?: string;
    title?: string;
    image?: string;
    artistName?: string;
    artistContentId?: number;
    completitionYear?: number;
    yearAsString?: string;
    height?: number;
    width?: number;
  }

export interface PaintingInformation {
  artistUrl: string;
  url: string;
  dictionaries: number[];
  location: string | null;
  period: string | null;
  serie: string;
  genre: string;
  material: string | null;
  style: string;
  technique: string | null;
  sizeX: number;
  sizeY: number;
  diameter: number | null;
  auction: string | null;
  yearOfTrade: number | null;
  lastPrice: number | null;
  galleryName: string;
  tags: string;
  description: string;
  title: string;
  contentId: number;
  artistContentId: number;
  artistName: string;
  completitionYear: number;
  yearAsString: string;
  width: number;
  image: string;
  height: number;
}