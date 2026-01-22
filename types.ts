

export enum Screen {
  Home,
  Search,
  MediaLibrary,
  Warning,
  System,
}

export enum Type {
  TYPE_UNSPECIFIED = 'TYPE_UNSPECIFIED',
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  INTEGER = 'INTEGER',
  BOOLEAN = 'BOOLEAN',
  ARRAY = 'ARRAY',
  OBJECT = 'OBJECT',
  NULL = 'NULL',
}

export interface MediaItem {
  id: number;
  title: string;
  src: string;
  size?: string;
  format?: string;
}

export interface WikiArticle {
    title: string;
    content: string;
    sources?: { title?: string; uri?: string }[];
}