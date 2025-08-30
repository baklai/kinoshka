import { EpisodeProps, MovieProps } from '@/types/movie.type';
import { validUrl } from '@/utils';
import { parseHTML } from 'linkedom';
import { createContext } from 'react';

export type CategoryType = {
  limit: number;
  title: string;
  source: string;
};

export type AppContextType = {
  name: string;
  baseUrl: string;
  searchUrl: string;
  categories: CategoryType[];
  getMovieCards: (baseUrl: string, source: string) => Promise<MovieProps[]>;
  searchMovieCards: (baseUrl: string, searchUrl: string, search: string) => Promise<MovieProps[]>;
  getMovieDetails: (baseUrl: string, source: string) => Promise<MovieProps | null>;
};

export const AppContextValue = {
  name: 'uakino.best',
  baseUrl: 'https://uakino.best',
  searchUrl: 'https://uakino.best',
  categories: [
    {
      limit: 10,
      title: 'Найкращі фільми українською',
      source: 'https://uakino.best/filmy/best'
    },
    {
      limit: 10,
      title: 'Найкращі серіали українською',
      source: 'https://uakino.best/seriesss/best'
    },
    {
      limit: 10,
      title: 'Найкраща анімація українською',
      source: 'https://uakino.best/cartoon/best'
    }
  ],
  getMovieCards: async (baseUrl: string, source: string): Promise<MovieProps[]> => {
    try {
      const response = await fetch(source);
      const html = await response.text();
      const { document } = parseHTML(html);
      const items = document.querySelectorAll('div.movie-item.short-item');

      return Array.from(items).map((item, index) => {
        const source = (item.querySelector('.movie-title') as HTMLAnchorElement)?.href || '';
        const title = item.querySelector('.movie-title')?.textContent?.trim() || '';
        const poster = (item.querySelector('.movie-img img') as HTMLImageElement)?.src || '';
        const quality = item.querySelector('.full-quality')?.textContent?.trim() || '';
        const likes =
          item.querySelector('.related-item-rating.positive')?.textContent?.trim() || '';

        return { source, title, poster: `${baseUrl}${poster}`, quality, likes };
      });
    } catch (err) {
      console.error('Error during request or parsing:', err);
      return [];
    }
  },
  searchMovieCards: async (
    baseUrl: string,
    searchUrl: string,
    search: string
  ): Promise<MovieProps[]> => {
    try {
      const params = new URLSearchParams({
        do: 'search',
        subaction: 'search',
        story: search
      });

      const response = await fetch(`${searchUrl}?${params.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const html = await response.text();
      const { document } = parseHTML(html);
      const items = document.querySelectorAll('div.movie-item.short-item');

      return Array.from(items).map(item => {
        const source = (item.querySelector('.full-movie') as HTMLAnchorElement)?.href || '';
        const title = item.querySelector('.full-movie-title')?.textContent?.trim() || '';
        const poster = (item.querySelector('img') as HTMLImageElement)?.src || '';
        const likes =
          item.querySelector('.related-item-rating.positive')?.textContent?.trim() || '';

        return { source, title, poster: `${baseUrl}${poster}`, likes };
      });
    } catch (err) {
      console.error('Error during request or parsing:', err);
      return [];
    }
  },
  getMovieDetails: async (baseUrl: string, source: string): Promise<MovieProps | null> => {
    try {
      const response = await fetch(source);
      const html = await response.text();
      const { document } = parseHTML(html);

      const block = document.querySelector('.film-info');
      if (!block) return null;

      const title = document.querySelector('span.solototle')?.textContent.trim() || null;
      const originalTitle = document.querySelector('span.origintitle')?.textContent.trim() || null;
      const description =
        document.querySelector('[itemprop="description"]')?.textContent.trim() || null;

      const poster = validUrl(
        (document.querySelector('.film-poster a') as HTMLAnchorElement)?.getAttribute('href'),
        baseUrl
      );

      const quality = block.querySelector('.film-poster .full-quality')?.textContent.trim() || null;
      const likes = block.querySelector('[data-likes-id]')?.textContent.trim() || null;
      const dislikes = block.querySelector('[data-dislikes-id]')?.textContent.trim() || null;
      const year =
        block.querySelector('.film-info .fi-item:nth-child(2) .fi-desc')?.textContent.trim() ||
        null;
      const age =
        block.querySelector('.film-info .fi-item:nth-child(3) .fi-desc')?.textContent.trim() ||
        null;
      const countries = Array.from(block.querySelectorAll('.fi-item:nth-child(4) .fi-desc a')).map(
        a => a.textContent.trim()
      );
      const genres = Array.from(block.querySelectorAll("[itemprop='genre'] a")).map(a =>
        a.textContent.trim()
      );
      const directors = Array.from(block.querySelectorAll('.fi-item .fi-label h2'))
        .filter(el => el.textContent.includes('Режисер'))
        .flatMap(el =>
          Array.from(el?.parentElement?.nextElementSibling?.querySelectorAll('a') ?? []).map(a =>
            a.textContent.trim()
          )
        );
      const actors = Array.from(block.querySelectorAll('.fi-item .fi-label h2'))
        .filter(el => el.textContent.includes('Актори'))
        .flatMap(el =>
          Array.from(el?.parentElement?.nextElementSibling?.querySelectorAll('a') ?? []).map(a =>
            a.textContent.trim()
          )
        );
      const duration =
        Array.from(block.querySelectorAll('.fi-item .fi-label h2'))
          .filter(el => el.textContent.includes('Тривалість'))
          .map(el => el.parentElement?.nextElementSibling?.textContent.trim())[0] || null;
      const imdb =
        Array.from(block.querySelectorAll(".fi-item img[alt*='imdb']")).map(el =>
          el?.parentElement?.nextElementSibling?.textContent.trim()
        )[0] || null;
      const iframeSrc = (document.querySelector('iframe') as HTMLElement)
        ?.getAttribute('src')
        ?.trim();
      const episodes: EpisodeProps[] = [];

      if (iframeSrc) {
        const iframeResponse = await fetch(iframeSrc);
        const iframeHtml = await iframeResponse.text();
        const fileMatch = iframeHtml.match(/file\s*:\s*"([^"]+)"/);
        const source = fileMatch ? fileMatch[1] : null;

        if (title && source) {
          episodes.push({ title, source });
        }
      }

      return {
        source,
        title,
        originalTitle,
        description,
        poster,
        quality,
        duration,
        age,
        year,
        imdb,
        likes,
        dislikes,
        countries,
        genres,
        directors,
        actors,
        episodes
      };
    } catch (err) {
      console.error('Error during request or parsing:', err);
      return null;
    }
  }
};

export const AppContext = createContext<AppContextType>({
  name: '',
  baseUrl: '',
  searchUrl: '',
  categories: [],
  getMovieCards: async () => [],
  searchMovieCards: async () => [],
  getMovieDetails: async () => null
});
