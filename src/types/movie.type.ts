export interface EpisodeProps {
  title: string;
  source: string;
}

export interface MovieProps {
  source: string;
  poster?: string | null;
  title: string | null;
  originalTitle?: string | null;
  description?: string | null;
  quality?: string | null;
  duration?: string | null;
  age?: string | null;
  year?: string | null;
  imdb?: string | null;
  likes?: string | null;
  dislikes?: string | null;
  genres?: string[];
  actors?: string[];
  directors?: string[];
  countries?: string[];
  episodes?: EpisodeProps[];
}
