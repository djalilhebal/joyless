import type { YtsMovie } from 'src/api/yts';

export interface EnrichedYtsMovie extends YtsMovie {
  // URN e.g. imdb:tt1234567
  key: string;
  coverUrl: string;
  imdbUrl: string;
  seen: boolean;
}
