import { MovieProps } from '@/types/movie.type';
import { parseHTML } from 'linkedom';

export const database = {
  version: '1.0.0.0',
  sources: [
    {
      name: 'uakino.best',
      baseUrl: 'https://uakino.best',
      categories: [
        {
          limit: 40,
          title: 'Найкращі фільми українською',
          source: 'https://uakino.best/filmy/best'
        },
        {
          limit: 40,
          title: 'Найкращі серіали українською',
          source: 'https://uakino.best/seriesss/best'
        },
        {
          limit: 40,
          title: 'Найкраща анімація',
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
            const id = `genre_detective-${index}`;
            const source = (item.querySelector('.movie-title') as HTMLAnchorElement)?.href || '';
            const title = item.querySelector('.movie-title')?.textContent?.trim() || '';
            const poster = (item.querySelector('.movie-img img') as HTMLImageElement)?.src || '';
            const quality = item.querySelector('.full-quality')?.textContent?.trim() || '';
            const likes =
              item.querySelector('.related-item-rating.positive')?.textContent?.trim() || '';

            return { id, source, title, poster: `${baseUrl}${poster}`, quality, likes };
          });
        } catch (err) {
          console.error('Ошибка при запросе или разборе:', err);
          return [];
        }
      },
      getMovieDetails: async (source: string): Promise<MovieProps | null> => {
        try {
          const response = await fetch(source);
          const html = await response.text();

          const { document } = parseHTML(html);

          const getText = (selector: string): string =>
            document.querySelector(selector)?.textContent?.trim() || '';

          const getAttrText = (selector: string, attr: string): string =>
            (document.querySelector(selector) as HTMLElement)?.getAttribute(attr)?.trim() || '';

          const findFiDesc = (label: string): string => {
            const items = Array.from(document.querySelectorAll('.fi-item'));
            for (const item of items) {
              const h2 = item.querySelector('h2');
              if (h2 && h2.textContent?.includes(label)) {
                return item.querySelector('.fi-desc')?.textContent?.trim() || '';
              }
            }
            return '';
          };

          const findFiArray = (label: string): string[] => {
            const items = Array.from(document.querySelectorAll('.fi-item'));
            for (const item of items) {
              const h2 = item.querySelector('h2');
              if (h2 && h2.textContent?.includes(label)) {
                return Array.from(item.querySelectorAll('.fi-desc a')).map(
                  el => el.textContent?.trim() || ''
                );
              }
            }
            return [];
          };

          const movieWrap = document.querySelector('div#dle-content');
          if (!movieWrap) {
            console.error('Элемент div#dle-content не найден');
            return null;
          }

          const title = getText('span.solototle');
          const originalTitle = getText('span.origintitle');
          const description = getText('div.full-text');

          const posterEl = movieWrap.querySelector(
            'div.film-poster img'
          ) as HTMLImageElement | null;
          const poster = posterEl ? new URL(posterEl.src, source).href : '';

          const quality = findFiDesc('Якість');
          const duration = findFiDesc('Тривалість');
          const age = findFiDesc('Вік. рейтинг');
          const year = findFiDesc('Рік виходу');

          let imdb = '';
          let votes = '';
          const imdbText = findFiDesc('imdb');
          if (imdbText.includes('/')) {
            [imdb, votes] = imdbText.split('/').map(s => s.trim());
          }

          const likes = getText('span[data-likes-id]');
          const dislikes = getText('span[data-dislikes-id]');
          const countries = findFiArray('Країна');
          const genres = findFiArray('Жанр');
          const directors = findFiArray('Режисер');
          const actors = findFiArray('Актори');

          const iframeSrc = getAttrText('iframe', 'src');

          const episodes: { title: string; source: string | null }[] = [];

          if (iframeSrc) {
            const iframeResponse = await fetch(iframeSrc);
            const iframeHtml = await iframeResponse.text();
            const fileMatch = iframeHtml.match(/file\s*:\s*"([^"]+)"/);
            const source = fileMatch ? fileMatch[1] : null;
            episodes.push({ title, source });
          }

          return {
            id: source,
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
          console.error('Ошибка при запросе или разборе:', err);
          return null;
        }
      }
    }
  ]
};
