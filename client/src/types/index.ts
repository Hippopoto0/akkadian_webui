export type TranslationState = 'prompt' | 'fetching' | 'answer';

export interface SentencePair {
  akk: string;
  // Add 'en' if you plan to display English examples too
  // en: string;
}

export interface Metadata {
    title: string;
    artifact_link: string;
    'Witness to composite(s)': string;
    'Primary Publication': string;
    Collection: string;
    'Museum no.': string;
    Provenience: string;
    Period: string;
    'Object Type': string;
    Material: string;
    Date: string;
}

export interface SearchResult {
    image_url: string;
    metadata: Metadata;
    transliteration: string[];
}

export type SearchResults = SearchResult[];