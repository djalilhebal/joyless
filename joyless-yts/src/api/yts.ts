// YTS API stuff

export interface YtsMovie {
  id: number;
  title: string;
  year: number;
  imdb_code: string;
  medium_cover_image: string;
}

export interface YtsSearchParams {
  genre: string;
  rating: number;
}

export async function getMovies(params: YtsSearchParams): Promise<YtsMovie[]> {
  const url = `https://yts.mx/api/v2/list_movies.json?genre=${params.genre}&limit=50&minimum_rating=${params.rating}&sort_by=download_count`;
  const response = await fetch(url).then((res) => res.json());
  if (response.status === 'ok') {
    return response.data.movies;
  } else {
    throw new Error(`YTS API error: ${response.status_message}`);
  }
}

export const GENRE_OPTIONS = [
  //{ value: null, label: 'All' },
  { value: 'action', label: 'Action' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'animation', label: 'Animation' },
  { value: 'biography', label: 'Biography' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'crime', label: 'Crime' },
  { value: 'documentary', label: 'Documentary' },
  { value: 'drama', label: 'Drama' },
  { value: 'family', label: 'Family' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'film-noir', label: 'Film-Noir' },
  { value: 'game-show', label: 'Game-Show' },
  { value: 'history', label: 'History' },
  { value: 'horror', label: 'Horror' },
  { value: 'music', label: 'Music' },
  { value: 'musical', label: 'Musical' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'news', label: 'News' },
  { value: 'reality-tv', label: 'Reality-TV' },
  { value: 'romance', label: 'Romance' },
  { value: 'sci-fi', label: 'Sci-Fi' },
  { value: 'sport', label: 'Sport' },
  { value: 'talk-show', label: 'Talk-Show' },
  { value: 'thriller', label: 'Thriller' },
  { value: 'war', label: 'War' },
  { value: 'western', label: 'Western' },
];

export const RATING_OPTIONS = [
  //{ value: null, label: 'All' },
  { value: 9, label: '9+' },
  { value: 8, label: '8+' },
  { value: 7, label: '7+' },
  { value: 6, label: '6+' },
  { value: 5, label: '5+' },
  { value: 4, label: '4+' },
  { value: 3, label: '3+' },
  { value: 2, label: '2+' },
  { value: 1, label: '1+' },
];
