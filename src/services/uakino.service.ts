/**
 * Сервіс для роботи з uakino.best:
 * парсинг карток, деталей фільму та епізодів серіалів.
 */

import { EpisodeProps, MovieProps } from '@/types/movie.type';
import { validUrl } from '@/utils';
import { parseHTML } from 'linkedom';
import { Platform } from 'react-native';

const BASE_URL = 'https://uakino.best';
const EPISODES_API = `${BASE_URL}/engine/ajax/playlists.php`;

// На вебі браузер блокує прямі запити через CORS — використовуємо проксі
const CORS_PROXY = 'https://corsproxy.io/?url=';

function proxyUrl(url: string): string {
  if (Platform.OS === 'web') {
    return `${CORS_PROXY}${encodeURIComponent(url)}`;
  }
  return url;
}

function log(tag: string, message: string) {
  if (process.env.NODE_ENV === 'development') {
    console.info(`${new Date().toISOString()} [${tag}] ${message}`);
  }
}

// ─── Картки фільмів ──────────────────────────────────────────────────────────

function parseMovieCard(item: Element, baseUrl: string): MovieProps {
  const source = (item.querySelector('.movie-title') as HTMLAnchorElement)?.href || '';
  const title = item.querySelector('.movie-title')?.textContent?.trim() || '';
  const poster = (item.querySelector('.movie-img img') as HTMLImageElement)?.src || '';
  const quality = item.querySelector('.full-quality')?.textContent?.trim() || '';
  const likes = item.querySelector('.related-item-rating.positive')?.textContent?.trim() || '';

  return { source, title, poster: `${baseUrl}${poster}`, quality, likes };
}

export async function getMovieCards(
  baseUrl: string,
  source: string,
  page?: number
): Promise<MovieProps[]> {
  const url = page ? `${source}/page/${page}/` : source;
  log('GET CARDS', url);

  try {
    const html = await fetch(proxyUrl(url)).then(r => r.text());
    const { document } = parseHTML(html);
    const items = document.querySelectorAll('div.movie-item.short-item');

    return Array.from(items).map(item => parseMovieCard(item, baseUrl));
  } catch (err) {
    console.error('Error fetching movie cards:', err);
    return [];
  }
}

// ─── Пошук ───────────────────────────────────────────────────────────────────

function parseSearchCard(item: Element, baseUrl: string): MovieProps {
  const source = (item.querySelector('.movie-title') as HTMLAnchorElement)?.href || '';
  const title = item.querySelector('.movie-title')?.textContent?.trim() || '';
  const poster = (item.querySelector('img') as HTMLImageElement)?.src || '';

  return { source, title, poster: `${baseUrl}${poster}` };
}

export async function searchMovieCards(
  baseUrl: string,
  searchUrl: string,
  search: string
): Promise<MovieProps[]> {
  log('POST SEARCH', `${searchUrl} : ${search}`);

  try {
    const params = new URLSearchParams({ do: 'search', subaction: 'search', story: search });

    const html = await fetch(proxyUrl(`${searchUrl}?${params.toString()}`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(r => r.text());

    const { document } = parseHTML(html);
    const items = document.querySelectorAll('div.movie-item.short-item');

    return Array.from(items).map(item => parseSearchCard(item, baseUrl));
  } catch (err) {
    console.error('Error searching movies:', err);
    return [];
  }
}

// ─── Деталі фільму ───────────────────────────────────────────────────────────

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
    const iframeHtml = await fetch(proxyUrl(iframeSrc)).then(r => r.text());
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

export async function getMovieDetails(baseUrl: string, source: string): Promise<MovieProps | null> {
  log('GET DETAILS', source);

  try {
    const html = await fetch(proxyUrl(source)).then(r => r.text());
    const { document } = parseHTML(html);

    const block = document.querySelector('.film-info');
    if (!block) return null;

    const title = document.querySelector('span.solototle')?.textContent?.trim() || null;
    const originalTitle = document.querySelector('span.origintitle')?.textContent?.trim() || null;
    const description =
      document.querySelector('[itemprop="description"]')?.textContent?.trim() || null;

    const poster = validUrl(
      (document.querySelector('.film-poster a') as HTMLAnchorElement)?.getAttribute('href'),
      baseUrl
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

// ─── Епізоди серіалу ─────────────────────────────────────────────────────────

async function resolveEpisodeSource(href: string): Promise<string> {
  try {
    const text = await fetch(proxyUrl(href)).then(r => r.text());
    return text.match(/file\s*:\s*['"]([^'"]+)['"]/)?.[1] || '';
  } catch {
    return '';
  }
}

export async function getMovieEpisodes(_baseUrl: string, source: string): Promise<EpisodeProps[]> {
  log('GET EPISODES', source);

  const id = source?.match(/\/[^/]+\/(\d+)-/)?.[1];
  if (!id) return [];

  try {
    const jsonData = await fetch(
      proxyUrl(`${EPISODES_API}?news_id=${id}&xfield=playlist`),
      {
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Accept: 'application/json, text/javascript, */*; q=0.01',
          Referer: source
        }
      }
    ).then(r => r.json());

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
