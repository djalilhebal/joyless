export interface YTSMovie {
  id: number,
  title: string,
  year: number,
  imdb_code: string,
  medium_cover_image: string,
}

export interface EnrichedYTSMovie extends YTSMovie {
  coverUrl: string,
  imdbUrl: string,
  seen: boolean,
}
