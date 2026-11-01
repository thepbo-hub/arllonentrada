import { BiositeKey } from './config/links';

export interface CardData {
  id: string;
  categoryKey: BiositeKey;
  number?: string;
  title: string;
  description: string;
  link: string;
  image: string;
  imageAlt: string;
  tag: string;
}

export type ViewMode = 'orbiting' | 'aligned';
