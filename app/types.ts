export interface Painting {
  contentId?: string;
  title?: string;
  image?: string;
  artistName?: string;
  artistContentId?: number | string;
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

export interface ArtistPainting {
  id: string;
  title: string;
  year: string;
  image: string;
  width: number;
  height: number;
  artistName: string;
  completitionYear: number;
  style: string;
  genre: string;
}

export interface ArtistInfo {
  id: string;
  artistName: string;
  biography: string;
  birthDayAsString: string;
  deathDayAsString: string;
  image: string;
  wikipediaUrl: string;
  nationality: string;
  activeYearsStart?: number;
  activeYearsEnd?: number;
  totalPaintings: number;
}
