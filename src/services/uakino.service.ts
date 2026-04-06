import { parseHTML } from 'linkedom';

import { EpisodeProps, MovieProps } from '@/types/movie.type';
import { ServiceType } from '@/types/service.type';
import { devlog, validUrl } from '@/utils';

const BASE_URL = 'https://uakino.best';
const SEARCH_URL = 'https://uakino.best/index.php';
const EPISODES_URL = `https://uakino.best/engine/ajax/playlists.php`;

const USER_AGENT =
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36';

const DEFAULT_HEADERS: HeadersInit = {
  'User-Agent': USER_AGENT,
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7'
};

function parseMovieCard(item: Element): MovieProps {
  const source = (item.querySelector('.movie-title') as HTMLAnchorElement)?.href || '';
  const title = item.querySelector('.movie-title')?.textContent?.trim() || '';
  const poster = (item.querySelector('.movie-img img') as HTMLImageElement)?.src || '';
  const quality = item.querySelector('.full-quality')?.textContent?.trim() || '';
  const likes = item.querySelector('.related-item-rating.positive')?.textContent?.trim() || '';

  return { source, title, poster: `${BASE_URL}${poster}`, quality, likes };
}

function parseSearchCard(item: Element): MovieProps {
  const source = (item.querySelector('.movie-title') as HTMLAnchorElement)?.href || '';
  const title = item.querySelector('.movie-title')?.textContent?.trim() || '';
  const poster = (item.querySelector('img') as HTMLImageElement)?.src || '';

  return { source, title, poster: `${BASE_URL}${poster}` };
}

function findLabeledField(block: Element, label: string): string | null {
  return (
    Array.from(block.querySelectorAll('.fi-item .fi-label h2'))
      .filter(el => el.textContent?.includes(label))
      .map(el => el.parentElement?.nextElementSibling?.textContent?.trim())[0] || null
  );
}

function findLabeledLinks(block: Element, label: string): string[] {
  return Array.from(block.querySelectorAll('.fi-item .fi-label h2'))
    .filter(el => el.textContent?.includes(label))
    .flatMap(el =>
      Array.from(el.parentElement?.nextElementSibling?.querySelectorAll('a') ?? []).map(
        a => a.textContent?.trim() ?? ''
      )
    );
}

async function parseEpisodesFromIframe(
  iframeSrc: string,
  fallbackTitle: string | null
): Promise<EpisodeProps[]> {
  try {
    const response = await fetch(iframeSrc, {
      headers: { ...DEFAULT_HEADERS }
    });

    const iframeHtml = await response.text();

    const fileMatch = iframeHtml.match(/file\s*:\s*['"]([^'"]+)['"]/);
    const source = fileMatch ? fileMatch[1] : null;

    if (fallbackTitle && source) {
      return [{ title: fallbackTitle, source }];
    }
  } catch (err) {
    console.error('Error fetching iframe:', err);
  }

  return [];
}

async function resolveEpisodeSource(href: string): Promise<string> {
  try {
    const response = await fetch(href, {
      headers: { ...DEFAULT_HEADERS }
    });
    const text = await response.text();
    return text.match(/file\s*:\s*['"]([^'"]+)['"]/)?.[1] || '';
  } catch {
    return '';
  }
}

async function getMovieCards(source: string, page?: number): Promise<MovieProps[]> {
  const url = page && page > 1 ? `${source}/page/${page}/` : source;
  devlog('GET CARDS', url);

  try {
    const response = await fetch(url, {
      headers: { ...DEFAULT_HEADERS }
    });

    const html = await response.text();

    const { document } = parseHTML(html);
    const items = document.querySelectorAll('div.movie-item.short-item');

    return Array.from(items).map(item => parseMovieCard(item));
  } catch (err) {
    console.error('Error fetching movie cards:', err);
    return [];
  }
}

async function searchMovieCards(search: string): Promise<MovieProps[]> {
  devlog('POST SEARCH', `${SEARCH_URL} : ${search}`);

  try {
    const params = new URLSearchParams({
      do: 'search',
      subaction: 'search',
      from_page: '0',
      story: search
    });

    const response = await fetch(SEARCH_URL, {
      method: 'POST',
      headers: { ...DEFAULT_HEADERS, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    const html = await response.text();

    const { document } = parseHTML(html);
    const items = document.querySelectorAll('div.movie-item.short-item');

    return Array.from(items).map(item => parseSearchCard(item));
  } catch (err) {
    console.error('Error searching movies:', err);
    return [];
  }
}

async function getMovieDetails(source: string): Promise<MovieProps | null> {
  devlog('GET DETAILS', source);

  try {
    const response = await fetch(source, {
      headers: { ...DEFAULT_HEADERS }
    });

    const html = await response.text();

    const { document } = parseHTML(html);

    const block = document.querySelector('.film-info');
    if (!block) return null;

    const title = document.querySelector('span.solototle')?.textContent?.trim() || null;
    const originalTitle = document.querySelector('span.origintitle')?.textContent?.trim() || null;
    const description =
      document.querySelector('[itemprop="description"]')?.textContent?.trim() || null;

    const poster = validUrl(
      (document.querySelector('.film-poster a') as HTMLAnchorElement)?.getAttribute('href'),
      BASE_URL
    );

    const quality = block.querySelector('.film-poster .full-quality')?.textContent?.trim() || null;
    const likes = block.querySelector('[data-likes-id]')?.textContent?.trim() || null;
    const dislikes = block.querySelector('[data-dislikes-id]')?.textContent?.trim() || null;
    const year =
      block.querySelector('.film-info .fi-item:nth-child(2) .fi-desc')?.textContent?.trim() || null;
    const age =
      block.querySelector('.film-info .fi-item:nth-child(3) .fi-desc')?.textContent?.trim() || null;
    const countries = Array.from(block.querySelectorAll('.fi-item:nth-child(4) .fi-desc a')).map(
      a => a.textContent?.trim() ?? ''
    );
    const genres = Array.from(block.querySelectorAll("[itemprop='genre'] a")).map(
      a => a.textContent?.trim() ?? ''
    );

    const directors = findLabeledLinks(block, 'Режисер');
    const actors = findLabeledLinks(block, 'Актори');
    const duration = findLabeledField(block, 'Тривалість');
    const imdb =
      Array.from(block.querySelectorAll(".fi-item img[alt*='imdb']")).map(el =>
        el.parentElement?.nextElementSibling?.textContent?.trim()
      )[0] || null;

    const iframeSrc = (document.querySelector('iframe') as HTMLElement)
      ?.getAttribute('src')
      ?.trim();

    const episodes = iframeSrc ? await parseEpisodesFromIframe(iframeSrc, title) : [];

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
    console.error('Error fetching movie details:', err);
    return null;
  }
}

async function getMovieEpisodes(source: string): Promise<EpisodeProps[]> {
  devlog('GET EPISODES', source);

  const id = source?.match(/\/(\d+)-[^/]+(?:\/|$)/)?.[1];

  if (!id) {
    console.warn('[GET EPISODES] Could not extract movie ID from URL:', source);
    return [];
  }

  try {
    const response = await fetch(`${EPISODES_URL}?news_id=${id}&xfield=playlist`, {
      method: 'GET',
      headers: {
        ...DEFAULT_HEADERS,
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json, text/javascript, */*; q=0.01',
        Referer: source
      }
    });

    const jsonData = await response.json();

    const { document } = parseHTML(jsonData.response);

    const firstVoice = document
      .querySelector('.playlists-items li[data-file]')
      ?.getAttribute('data-voice');

    const items = Array.from(
      document.querySelectorAll(`.playlists-items li[data-voice="${firstVoice}"]`)
    );

    const episodes = await Promise.all(
      items.map(async item => {
        const href = item.getAttribute('data-file');
        if (!href) return null;

        const episodeSource = await resolveEpisodeSource(href);
        return episodeSource
          ? { title: item.textContent?.trim() || '', source: episodeSource }
          : null;
      })
    );

    return episodes.filter((ep): ep is EpisodeProps => ep !== null);
  } catch (error) {
    console.error('Error fetching episodes:', error);
    return [];
  }
}

export const uakino: ServiceType = {
  key: 'uakino',
  name: 'uakino.best',
  categories: [
    { key: 'filmy', title: 'Фільми - останні додані', source: `${BASE_URL}/filmy` },
    { key: 'filmy-online', title: 'Фільми - дивляться зараз', source: `${BASE_URL}/filmy/online` },
    { key: 'filmy-best', title: 'Найкращі фільми українською', source: `${BASE_URL}/filmy/best` },
    { key: 'seriesss', title: 'Серіали - останні додані', source: `${BASE_URL}/seriesss` },
    {
      key: 'seriesss-online',
      title: 'Серіали - дивляться зараз',
      source: `${BASE_URL}/seriesss/online`
    },
    {
      key: 'seriesss-best',
      title: 'Найкращі серіали українською',
      source: `${BASE_URL}/seriesss/best`
    },
    { key: 'cartoon', title: 'Мультфільми - останні додані', source: `${BASE_URL}/cartoon` },
    {
      key: 'cartoon-online',
      title: 'Мультфільми - дивляться зараз',
      source: `${BASE_URL}/cartoon/online`
    },
    {
      key: 'cartoon-best',
      title: 'Найкращі мультфільми українською',
      source: `${BASE_URL}/cartoon/best`
    }
  ],
  getMovieCards,
  searchMovieCards,
  getMovieDetails,
  getMovieEpisodes
};
