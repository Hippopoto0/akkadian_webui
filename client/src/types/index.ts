export type TranslationState = 'prompt' | 'fetching' | 'answer';

export interface SentencePair {
  akk: string;
  // Add 'en' if you plan to display English examples too
  // en: string;
}