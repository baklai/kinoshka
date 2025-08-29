export interface MovieProps {
  source: string;
  poster?: string;
  title: string;
  originalTitle?: string;
  description?: string;
  quality?: string;
  duration?: string;
  age?: string;
  year?: string;
  imdb?: string;
  likes?: string;
  dislikes?: string;
  genres?: string[];
  actors?: string[];
  directors?: string[];
  countries?: string[];
  episodes?: Record<string, any>[];
}
