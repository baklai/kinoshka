import { EpisodeProps, MovieProps } from '@/types/movie.type';
import { validUrl } from '@/utils';
import { parseHTML } from 'linkedom';
import { createContext } from 'react';

export type CategoryType = {
  title: string;
  source: string;
};

export type AppContextType = {
  name: string;
  baseUrl: string;
  searchUrl: string;
  categories: CategoryType[];
  getMovieCards: (baseUrl: string, source: string, page?: number) => Promise<MovieProps[]>;
  searchMovieCards: (baseUrl: string, searchUrl: string, search: string) => Promise<MovieProps[]>;
  getMovieDetails: (baseUrl: string, source: string) => Promise<MovieProps | null>;
  getMovieEpisodes: (baseUrl: string, source: string) => Promise<EpisodeProps[]>;
};

export const AppContextValue = {
  name: 'uakino.best',
  baseUrl: 'https://uakino.best',
  searchUrl: 'https://uakino.best',
  categories: [
    {
      title: 'Фільми - останні додані',
      source: 'https://uakino.best/filmy'
    },
    {
      title: 'Фільми - дивляться зараз',
      source: 'https://uakino.best/filmy/online'
    },
    {
      title: 'Найкращі фільми українською',
      source: 'https://uakino.best/filmy/best'
    },
    {
      title: 'Серіали - останні додані',
      source: 'https://uakino.best/seriesss'
    },
    {
      title: 'Серіали - дивляться зараз',
      source: 'https://uakino.best/seriesss/online'
    },
    {
      title: 'Найкращі серіали українською',
      source: 'https://uakino.best/seriesss/best'
    },
    {
      title: 'Мультфільми - останні додані',
      source: 'https://uakino.best/cartoon'
    },
    {
      title: 'Мультфільми - дивляться зараз',
      source: 'https://uakino.best/cartoon/online'
    },
    {
      title: 'Найкращі мультфільми українською',
      source: 'https://uakino.best/cartoon/best'
    }
  ],
  getMovieCards: async (baseUrl: string, source: string, page?: number): Promise<MovieProps[]> => {
    if (process.env.NODE_ENV === 'development') {
      console.info(`${new Date()} [GET CARDS] ${source}/page/${page}/`);
    }

    try {
      const response = page ? await fetch(`${source}/page/${page}/`) : await fetch(source);
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
    if (process.env.NODE_ENV === 'development') {
      console.info(`${new Date()} [POST SEARCH] ${searchUrl} : ${search}`);
    }

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
        const source = (item.querySelector('.movie-title') as HTMLAnchorElement)?.href || '';
        const title = item.querySelector('.movie-title')?.textContent?.trim() || '';
        const poster = (item.querySelector('img') as HTMLImageElement)?.src || '';

        return { source, title, poster: `${baseUrl}${poster}` };
      });
    } catch (err) {
      console.error('Error during request or parsing:', err);
      return [];
    }
  },
  getMovieDetails: async (baseUrl: string, source: string): Promise<MovieProps | null> => {
    if (process.env.NODE_ENV === 'development') {
      console.info(`${new Date()} [GET DETAILS] ${source}`);
    }

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
  },
  getMovieEpisodes: async (baseUrl: string, source: string): Promise<EpisodeProps[]> => {
    if (process.env.NODE_ENV === 'development') {
      console.info(`${new Date()} [GET EPISODES] ${source}`);
    }

    const episodes: EpisodeProps[] = [];

    try {
      const id = source?.match(/\/[^\/]+\/(\d+)-/)?.[1];

      if (id) {
        const response = await fetch(
          `https://uakino.best/engine/ajax/playlists.php?news_id=${id}&xfield=playlist`,
          {
            method: 'GET',
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              Accept: 'application/json, text/javascript, */*; q=0.01',
              Referer: source
            }
          }
        );
        const jsonData = await response.json();

        const { document } = parseHTML(jsonData.response);

        const firstLiItem = document
          .querySelector('.playlists-items li[data-file]')
          ?.getAttribute('data-voice');

        const templateEpisodes = await Promise.all(
          Array.from(
            document.querySelectorAll(`.playlists-items li[data-voice="${firstLiItem}"]`)
          ).map(async item => {
            const href = item?.getAttribute('data-file');

            if (href) {
              const file = (await fetch(href).then(r => r.text())).match(
                /file\s*:\s*"([^"]+)"/
              )?.[1];

              return {
                title: item?.textContent?.trim() || '',
                source: file || ''
              };
            }

            return null;
          })
        );

        const validEpisodes = templateEpisodes.filter(
          (item): item is EpisodeProps => item !== null
        );

        episodes.push(...validEpisodes);
      }
    } catch (error) {
      console.error('Error during request or parsing episodes:', error);
    } finally {
      return episodes;
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
  getMovieDetails: async () => null,
  getMovieEpisodes: async () => []
});
