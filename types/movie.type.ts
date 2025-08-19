export interface MovieProps {
  id: string;
  title: string;
  originalTitle?: string;
  description?: string;
  poster?: string;
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
