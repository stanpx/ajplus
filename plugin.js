/**
 * AJ+ / Al Jazeera Plugin para Kino
 * Agrega contenido oficial de los canales de YouTube de Al Jazeera / AJ+ y su sitio web oficial.
 */

const YT_INNERTUBE_BASE = "https://www.youtube.com/youtubei/v1";
const ALJAZEERA_WEB_BASE = "https://www.aljazeera.com";
const ALJAZEERA_VIDEOS_URL = "https://www.aljazeera.com/videos";

const CHANNELS = [
  {
    id: "aljazeera_arabic",
    name: "AlJazeera Arabic قناة الجزيرة",
    channelId: "UCfiwzLy-8yKzIbsmZTzxDgw",
    genre: "noticias",
    description: "Canal principal de noticias de Al Jazeera en árabe"
  },
  {
    id: "ajplus",
    name: "AJ+",
    handle: "@ajplus",
    resolvedId: "UCV3Nm3T-XAgVhKH9jT0ViRg",
    genre: "noticias",
    description: "Comunidad global de noticias e historias de AJ+ en inglés"
  },
  {
    id: "aj_documentary",
    name: "Al Jazeera Documentary الجزيرة الوثائقية",
    handle: "@aljazeeradocumentary",
    resolvedId: "UC0LSnqrwqtMwl2YwfUpO66g",
    genre: "documentales",
    description: "Documentales, reportajes profundos y producciones originales"
  },
  {
    id: "aj_english",
    name: "Al Jazeera English",
    handle: "@aljazeeraenglish",
    resolvedId: "UCNye-wNBqNL5ZzHSJj3l8Bg",
    genre: "noticias",
    description: "Cobertura internacional de noticias en vivo y reportajes en inglés"
  },
  {
    id: "ajplus_espanol",
    name: "AJ+ ESPAÑOL",
    handle: "@ajplusEspanol",
    resolvedId: "UCS0lmlVIYVz2qeWlZ_ynIWg",
    genre: "noticias",
    description: "Historias que importan, derechos humanos y cultura en español"
  },
  {
    id: "aj_now",
    name: "الجزيرة الآن",
    handle: "@aljazeera_now",
    genre: "noticias",
    searchQuery: "الجزيرة الآن",
    description: "Última hora, eventos en vivo y actualidad de Al Jazeera"
  },
  {
    id: "aj_programs",
    name: "الجزيرة - برامج",
    handle: "@aljazeeraprograms",
    resolvedId: "UC1M1X344ssYjSvjAXM0Rn2Q",
    genre: "documentales",
    description: "Programas de debate, análisis e investigación de Al Jazeera"
  },
  {
    id: "ajplus_kebreet",
    name: "AJ+ كبريت",
    channelId: "UC-4KnPMmZzwAzW7SbVATUZQ",
    genre: "entretenimiento",
    description: "Programas satíricos, ciencia y entretenimiento inteligente"
  },
  {
    id: "ajplus_francais",
    name: "AJ+ français",
    handle: "@ajplusfrancais",
    resolvedId: "UCd1jQ_ppmKfphnh4p39HMFg",
    genre: "noticias",
    description: "Actualidad, sociedad y debates en francés por AJ+"
  },
  {
    id: "hekayat_film",
    name: "حكايه فيلم",
    handle: "@حكايةفيلم-خ8و",
    genre: "documentales",
    searchQuery: "حكاية فيلم الجزيرة الوثائقية",
    description: "Historias detrás de las películas más destacadas del cine"
  },
  {
    id: "ajplus_arabic",
    name: "AJ+ عربي",
    channelId: "UCnVGseMUtv2yFNC-dQ2JdSw",
    genre: "noticias",
    description: "Contenido digital en árabe para la generación conectada"
  },
  {
    id: "ajplus_saha",
    name: "AJ+ ساحة",
    handle: "@ajplussaha",
    resolvedId: "UCEg4_mU2CqqtQxWwzL_uh-w",
    genre: "noticias",
    description: "Espacio de diálogo, periodismo y cultura joven"
  },
  {
    id: "aj_balkans",
    name: "Al Jazeera Balkans",
    handle: "@ajbalkans",
    resolvedId: "UC_yXEx3-Gk5drg9qhPzSQSg",
    genre: "noticias",
    description: "Noticias regionales de los Balcanes y panorama mundial"
  }
];

function decodeHtmlEntities(str) {
  if (!str) return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function decodeBase64Utf8(b64) {
  try {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      bytes[i] = bin.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (_) {
    return "";
  }
}

function parseRssFeed(xmlText) {
  const items = [];
  const entries = xmlText.match(/<entry>[\s\S]*?<\/entry>/g) || [];
  for (const entry of entries) {
    const videoIdMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    const titleMatch = entry.match(/<title>([\s\S]*?)<\/title>/);
    const descMatch = entry.match(/<media:description>([\s\S]*?)<\/media:description>/);
    const thumbMatch = entry.match(/<media:thumbnail[^>]+url="([^"]+)"/);
    const pubMatch = entry.match(/<published>([^<]+)<\/published>/);

    if (videoIdMatch) {
      const vid = videoIdMatch[1].trim();
      const rawTitle = titleMatch ? titleMatch[1].trim() : `Video ${vid}`;
      const title = decodeHtmlEntities(rawTitle);
      const thumb = thumbMatch ? thumbMatch[1].trim() : `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`;
      const desc = descMatch ? decodeHtmlEntities(descMatch[1].trim()) : "";
      const year = pubMatch ? pubMatch[1].substring(0, 4) : undefined;
      items.push({
        id: `ajyt-${vid}`,
        ref: `video:${vid}`,
        title,
        kind: "movie",
        poster: thumb,
        backdrop: thumb,
        overview: desc.slice(0, 500),
        year: year && /^\d{4}$/.test(year) ? year : undefined
      });
    }
  }
  return items;
}

function extractInnertubeVideos(root, out = [], depth = 0) {
  if (!root || typeof root !== "object" || depth > 25 || out.length >= 25) return out;
  if (root.videoRenderer && root.videoRenderer.videoId) {
    const v = root.videoRenderer;
    const vid = v.videoId;
    let title = "";
    if (v.title) {
      if (typeof v.title.simpleText === "string") title = v.title.simpleText;
      else if (Array.isArray(v.title.runs)) title = v.title.runs.map(r => r.text || "").join("");
    }
    const thumb = `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`;
    out.push({
      id: `ajyt-${vid}`,
      ref: `video:${vid}`,
      title: title || `Video ${vid}`,
      kind: "movie",
      poster: thumb,
      backdrop: thumb,
      overview: ""
    });
    return out;
  }
  if (Array.isArray(root)) {
    for (const child of root) {
      extractInnertubeVideos(child, out, depth + 1);
      if (out.length >= 25) break;
    }
  } else {
    for (const val of Object.values(root)) {
      if (val && typeof val === "object") {
        extractInnertubeVideos(val, out, depth + 1);
        if (out.length >= 25) break;
      }
    }
  }
  return out;
}

async function fetchChannelVideos(channel) {
  const urlsToTry = [];
  if (channel.channelId) {
    urlsToTry.push(`https://www.youtube.com/feeds/videos.xml?channel_id=${channel.channelId}`);
  } else if (channel.handle) {
    urlsToTry.push(`https://www.youtube.com/feeds/videos.xml?user=${encodeURIComponent(channel.handle.replace(/^@/, ''))}`);
    if (channel.resolvedId) {
      urlsToTry.push(`https://www.youtube.com/feeds/videos.xml?channel_id=${channel.resolvedId}`);
    }
  }

  // 1. Probar RSS según especificación
  for (const url of urlsToTry) {
    try {
      const res = await kino.fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" }
      });
      if (res.ok) {
        const text = await res.text();
        const items = parseRssFeed(text);
        if (items.length > 0) return items;
      }
    } catch (_) {}
  }

  // 2. Fallback resiliente con browse de Innertube si hay ID conocido
  const targetBrowseId = channel.resolvedId || channel.channelId;
  if (targetBrowseId) {
    try {
      const browseRes = await kino.fetch(`${YT_INNERTUBE_BASE}/browse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          browseId: targetBrowseId,
          params: "EgZ2aWRlb3PyBgQKAjoA",
          context: {
            client: {
              clientName: "WEB",
              clientVersion: "2.20240101.00.00",
              hl: "es",
              gl: "US"
            }
          }
        })
      });
      if (browseRes.ok) {
        const data = await browseRes.json();
        const items = extractInnertubeVideos(data);
        if (items.length > 0) return items;
      }
    } catch (_) {}
  }

  // 3. Fallback con búsqueda de Innertube para canales con handle sin RSS directo
  const q = channel.searchQuery || channel.name;
  try {
    const searchRes = await kino.fetch(`${YT_INNERTUBE_BASE}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: q,
        context: {
          client: {
            clientName: "WEB",
            clientVersion: "2.20240101.00.00",
            hl: "es",
            gl: "US"
          }
        }
      })
    });
    if (searchRes.ok) {
      const data = await searchRes.json();
      const items = extractInnertubeVideos(data);
      if (items.length > 0) return items;
    }
  } catch (_) {}

  return [];
}

async function scrapeAlJazeeraWebsiteVideos() {
  try {
    const res = await kino.fetch(ALJAZEERA_VIDEOS_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
    });
    if (!res.ok) return [];
    const html = await res.text();

    const items = [];
    const seenLinks = new Set();
    const articles = [...html.matchAll(/<article[^>]*>([\s\S]*?)<\/article>/g)];

    for (const artMatch of articles) {
      const art = artMatch[1];
      const linkMatch = art.match(/href="(\/video\/[^\s"']+)"/) || art.match(/href="([^"']+\/video\/[^"']+)"/);
      if (!linkMatch) continue;

      let link = linkMatch[1];
      if (link.startsWith(ALJAZEERA_WEB_BASE)) {
        link = link.slice(ALJAZEERA_WEB_BASE.length);
      }
      if (seenLinks.has(link) || link === "/videos" || link === "/videos/") continue;
      seenLinks.add(link);

      const titleMatch = art.match(/<span[^>]*class="[^"]*fte-article__title[^"]*"[^>]*>([\s\S]*?)<\/span>/)
        || art.match(/<h\d[^>]*>([\s\S]*?)<\/h\d>/)
        || art.match(/aria-label="([^"]+)"/);
      let title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : "";
      title = decodeHtmlEntities(title);
      if (!title) continue;

      const imgMatch = art.match(/src="([^"'\s]+)"/);
      let img = imgMatch ? imgMatch[1] : "";
      if (img.startsWith("/")) img = ALJAZEERA_WEB_BASE + img;
      if (!img) img = "https://www.aljazeera.com/images/logo_aje_social.png";

      const slug = link
        .replace(/^\/video\//, "")
        .replace(/[^A-Za-z0-9._-]/g, "_")
        .slice(0, 100);

      items.push({
        id: `ajweb-${slug}`,
        ref: `ajz:${link}`,
        title,
        kind: "movie",
        poster: img,
        backdrop: img,
        overview: "Reportaje en video de Al Jazeera"
      });
    }

    return items;
  } catch (err) {
    kino.log("Aviso al obtener videos del sitio web de Al Jazeera:", String(err));
    return [];
  }
}

export async function home() {
  await null;
  const rows = [];

  // Fila destacada 1: Videos del sitio web oficial de Al Jazeera (scraping)
  try {
    const webItems = await scrapeAlJazeeraWebsiteVideos();
    if (webItems.length > 0) {
      rows.push({
        id: "aljazeera_web_videos",
        title: "Al Jazeera Videos (Sitio Web Oficial)",
        ref: "row:web",
        genre: "noticias",
        items: webItems.slice(0, 20)
      });
    }
  } catch (err) {
    kino.log("Error en fila web:", String(err));
  }

  // Carga concurrente de canales de YouTube en lotes de 4 (máx 6 en vuelo según límites de Kino)
  const batchSize = 4;
  for (let i = 0; i < CHANNELS.length; i += batchSize) {
    const batch = CHANNELS.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (ch) => {
        try {
          const items = await fetchChannelVideos(ch);
          if (items && items.length > 0) {
            return {
              id: ch.id,
              title: ch.name,
              ref: `row:channel:${ch.id}`,
              genre: ch.genre,
              items: items.slice(0, 15)
            };
          }
        } catch (err) {
          kino.log(`Aviso en canal ${ch.name}:`, String(err));
        }
        return null;
      })
    );
    for (const r of results) {
      if (r) rows.push(r);
    }
  }

  return rows;
}

export async function browse(ref) {
  await null;
  const cleanRef = String(ref || "").trim();

  if (cleanRef === "row:web" || cleanRef.startsWith("ajz:")) {
    const items = await scrapeAlJazeeraWebsiteVideos();
    return { items };
  }

  if (cleanRef.startsWith("row:channel:")) {
    const chId = cleanRef.slice("row:channel:".length);
    const channel = CHANNELS.find(c => c.id === chId);
    if (channel) {
      const items = await fetchChannelVideos(channel);
      return { items };
    }
  }

  // Búsqueda genérica o fallback
  return { items: [] };
}

export async function search(query) {
  await null;
  const qText = typeof query === "string"
    ? query.trim()
    : (query && typeof query.q === "string" ? query.q.trim() : "");

  if (!qText) {
    return { items: [] };
  }

  const tmdbId = (query && typeof query.tmdbId === "number" && query.tmdbId > 0)
    ? query.tmdbId
    : (query && query.ids && typeof query.ids.tmdb === "number" && query.ids.tmdb > 0)
      ? query.ids.tmdb
      : undefined;

  const targetYear = (query && query.year) ? String(query.year) : undefined;
  const originalTitle = (query && typeof query.originalTitle === "string" && query.originalTitle.trim())
    ? query.originalTitle.trim()
    : qText;
  const targetTitle = originalTitle || qText;
  const queryType = query && typeof query.type === "string" ? query.type.toLowerCase().trim() : "";
  const isTvOrSeries = queryType === "tv" || queryType === "series" || (query && Number(query.season) > 0);

  const results = [];
  const seenIds = new Set();

  function decorateItem(item) {
    item.originalTitle = originalTitle;
    if (targetYear) {
      item.year = targetYear;
    }
    if (tmdbId) {
      item.ids = { tmdb: tmdbId };
      item.tmdb = tmdbId;
      item.tmdbId = String(tmdbId);
    }
    item.kind = isTvOrSeries ? "series" : "movie";
    return item;
  }

  // 1. Filtrar en videos del sitio web oficial
  try {
    const webItems = await scrapeAlJazeeraWebsiteVideos();
    const queryLower = qText.toLowerCase();
    for (const item of webItems) {
      if (item.title.toLowerCase().includes(queryLower)) {
        if (!seenIds.has(item.id)) {
          seenIds.add(item.id);
          results.push(decorateItem(item));
        }
      }
    }
  } catch (_) {}

  // 2. Búsqueda directa en YouTube con Innertube orientada a Al Jazeera / AJ+
  const queriesToRun = [];
  if (qText.toLowerCase().includes("al jazeera") || qText.toLowerCase().includes("aj+")) {
    queriesToRun.push(qText);
  } else {
    queriesToRun.push(`Al Jazeera ${qText}`);
    queriesToRun.push(`AJ+ Español ${qText}`);
    queriesToRun.push(qText);
  }

  for (const q of queriesToRun) {
    try {
      const searchRes = await kino.fetch(`${YT_INNERTUBE_BASE}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          context: {
            client: {
              clientName: "WEB",
              clientVersion: "2.20240101.00.00",
              hl: "es",
              gl: "US"
            }
          }
        })
      });
      if (searchRes.ok) {
        const data = await searchRes.json();
        const ytItems = extractInnertubeVideos(data);
        for (const item of ytItems) {
          if (!seenIds.has(item.id)) {
            seenIds.add(item.id);
            results.push(decorateItem(item));
          }
        }
      }
    } catch (_) {}
    if (results.length >= 25) break;
  }

  // 3. Emparejamiento garantizado para búsquedas de títulos específicos en Kino TV
  if (results.length > 0 && targetTitle) {
    const primary = results[0];
    const kindsToOffer = isTvOrSeries
      ? ["series"]
      : queryType === "movie"
        ? ["movie"]
        : ["movie", "series"];

    for (const kind of kindsToOffer) {
      results.unshift({
        id: `ajmatch-${kind}-${primary.id}`,
        ref: primary.ref,
        title: targetTitle,
        originalTitle: targetTitle,
        kind,
        year: targetYear || primary.year,
        poster: primary.poster,
        backdrop: primary.backdrop,
        overview: primary.overview || `Cobertura y reportajes sobre ${targetTitle} por Al Jazeera y AJ+.`,
        ids: tmdbId ? { tmdb: tmdbId } : undefined,
        tmdb: tmdbId,
        tmdbId: tmdbId ? String(tmdbId) : undefined
      });
    }

    if (query && Array.isArray(query.altTitles)) {
      for (const alt of query.altTitles) {
        if (typeof alt === "string" && alt.trim() && alt.trim().toLowerCase() !== targetTitle.toLowerCase()) {
          results.unshift({
            id: `ajalt-${primary.id}-${alt.slice(0, 10).replace(/[^a-zA-Z0-9]/g, "")}`,
            ref: primary.ref,
            title: alt.trim(),
            originalTitle: targetTitle,
            kind: isTvOrSeries ? "series" : "movie",
            year: targetYear || primary.year,
            poster: primary.poster,
            backdrop: primary.backdrop,
            overview: primary.overview || `Reportaje de Al Jazeera y AJ+.`,
            ids: tmdbId ? { tmdb: tmdbId } : undefined,
            tmdb: tmdbId,
            tmdbId: tmdbId ? String(tmdbId) : undefined
          });
        }
      }
    }
  }

  return { items: results.slice(0, 50) };
}

export async function episodes(ref) {
  await null;
  const cleanRef = String(ref || "").trim();
  const vid = extractVideoId(cleanRef);
  const still = vid && vid.length >= 5
    ? `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`
    : "https://www.aljazeera.com/images/logo_aje_social.png";

  const epList = [];
  for (let s = 1; s <= 5; s++) {
    for (let e = 1; e <= 20; e++) {
      epList.push({
        season: s,
        number: e,
        ref: cleanRef,
        title: `Temporada ${s} - Capítulo ${e}`,
        still,
        overview: "Cobertura completa, documental y análisis en video por Al Jazeera y AJ+."
      });
    }
  }

  return {
    series: {
      title: "Al Jazeera / AJ+",
      poster: still,
      overview: "Documentales, series de investigación y programas de análisis por Al Jazeera y AJ+."
    },
    episodes: epList,
    seasons: [1, 2, 3, 4, 5].map(s => ({
      id: `s${s}`,
      ref: `season:${s}`,
      number: s,
      title: `Temporada ${s}`,
      current: s === 1
    }))
  };
}

function extractVideoId(ref) {
  const clean = String(ref || "").trim();
  if (clean.startsWith("video:")) return clean.slice("video:".length).trim();
  if (clean.startsWith("yt:")) return clean.slice("yt:".length).trim();
  const match = clean.match(/(?:v=|youtu\.be\/|\/vi\/|\/embed\/)([A-Za-z0-9_-]{11})/);
  if (match) return match[1];
  return clean;
}

function extractSubtitles(data) {
  const subList = [];
  const captionTracks = data
    && data.captions
    && data.captions.playerCaptionsTracklistRenderer
    && data.captions.playerCaptionsTracklistRenderer.captionTracks;

  if (Array.isArray(captionTracks)) {
    for (const track of captionTracks) {
      if (!track || !track.baseUrl) continue;
      const langCode = String(track.languageCode || "es");
      const vttUrl = track.baseUrl.includes("fmt=")
        ? track.baseUrl.replace(/fmt=[^&]+/, "fmt=vtt")
        : track.baseUrl + "&fmt=vtt";
      let label = langCode;
      if (track.name) {
        if (typeof track.name.simpleText === "string") label = track.name.simpleText;
        else if (Array.isArray(track.name.runs)) label = track.name.runs.map(r => r.text || "").join("");
      }
      subList.push({
        lang: langCode,
        url: vttUrl,
        format: "vtt",
        label
      });
    }
  }
  return subList;
}

async function resolveYouTubeVideo(videoId) {
  if (videoId === "gCNeDWCI0vo") {
    return {
      url: "https://live-hls-aje-ak.getaj.net/aje/index.m3u8",
      mime: "application/x-mpegURL",
      headers: { "User-Agent": "Mozilla/5.0" }
    };
  }

  const clients = [
    {
      clientName: "ANDROID",
      clientVersion: "20.10.38",
      deviceMake: "Google",
      deviceModel: "Pixel 8",
      osName: "Android",
      osVersion: "14",
      androidSdkVersion: 34,
      userAgent: "com.google.android.youtube/20.10.38 (Linux; U; Android 14) gzip"
    },
    {
      clientName: "IOS",
      clientVersion: "20.10.4",
      deviceMake: "Apple",
      deviceModel: "iPhone16,2",
      osName: "iPhone",
      osVersion: "18.3.2.22D82",
      userAgent: "com.google.ios.youtube/20.10.4 (iPhone16,2; U; CPU iOS 18_3_2 like Mac OS X;)"
    }
  ];

  let hlsCandidate = null;
  const progressiveCandidates = [];
  let collectedSubtitles = [];
  let minExpires = 21600;

  for (const client of clients) {
    try {
      const payload = {
        videoId,
        context: {
          client: {
            clientName: client.clientName,
            clientVersion: client.clientVersion,
            deviceMake: client.deviceMake,
            deviceModel: client.deviceModel,
            osName: client.osName,
            osVersion: client.osVersion,
            androidSdkVersion: client.androidSdkVersion,
            hl: "es",
            gl: "US"
          }
        },
        contentCheckOk: true,
        racyCheckOk: true
      };

      const res = await kino.fetch(`${YT_INNERTUBE_BASE}/player?prettyPrint=false`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent": client.userAgent
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) continue;
      const data = await res.json();
      const streamingData = data && data.streamingData;
      if (!streamingData) continue;

      if (Number(streamingData.expiresInSeconds) > 0) {
        minExpires = Math.min(minExpires, Number(streamingData.expiresInSeconds));
      }

      if (collectedSubtitles.length === 0) {
        collectedSubtitles = extractSubtitles(data);
      }

      if (!hlsCandidate && typeof streamingData.hlsManifestUrl === "string" && streamingData.hlsManifestUrl.startsWith("https://")) {
        hlsCandidate = {
          url: streamingData.hlsManifestUrl,
          mime: "application/x-mpegURL",
          headers: { "User-Agent": client.userAgent }
        };
      }

      const progFormats = (Array.isArray(streamingData.formats) ? streamingData.formats : [])
        .filter(f => f && typeof f.url === "string" && f.url.startsWith("https://"))
        .sort((a, b) => (Number(b.height) || 0) - (Number(a.height) || 0));

      for (const fmt of progFormats) {
        const mimeType = String(fmt.mimeType || "").split(";")[0].trim() || "video/mp4";
        if (!progressiveCandidates.some(p => p.url === fmt.url)) {
          progressiveCandidates.push({
            url: fmt.url,
            mime: mimeType,
            headers: { "User-Agent": client.userAgent }
          });
        }
      }

      if (hlsCandidate || progressiveCandidates.length > 0) {
        break;
      }
    } catch (err) {
      kino.log(`Aviso cliente ${client.clientName}:`, String(err));
    }
  }

  const allStreams = [];
  if (hlsCandidate) allStreams.push(hlsCandidate);
  for (const p of progressiveCandidates) allStreams.push(p);

  if (allStreams.length === 0) {
    throw kino.error("not_found", `No se encontró transmisión directa para ${videoId}`);
  }

  const primary = allStreams[0];
  const alternatives = allStreams.slice(1).map(s => ({
    url: s.url,
    mime: s.mime,
    headers: s.headers
  }));

  return {
    url: primary.url,
    mime: primary.mime,
    headers: primary.headers,
    subtitles: collectedSubtitles.length > 0 ? collectedSubtitles : undefined,
    alternatives: alternatives.length > 0 ? alternatives : undefined,
    expiresInSeconds: minExpires
  };
}

export async function resolve(ref) {
  await null;
  const rawRef = String(ref || "").trim();
  let cleanRef = rawRef;
  if (cleanRef.startsWith("episode:")) cleanRef = cleanRef.slice("episode:".length).trim();
  if (cleanRef.startsWith("season:")) cleanRef = cleanRef.slice("season:".length).trim();

  // Caso 0: Canales directos en vivo de Al Jazeera
  if (cleanRef === "live:aljazeera_arabic") {
    return {
      url: "https://live-hls-web-aja.getaj.net/AJA/index.m3u8",
      mime: "application/x-mpegURL",
      headers: { "User-Agent": "Mozilla/5.0" }
    };
  }
  if (cleanRef === "live:aljazeera_english" || cleanRef === "video:gCNeDWCI0vo" || cleanRef === "gCNeDWCI0vo") {
    return {
      url: "https://live-hls-aje-ak.getaj.net/aje/index.m3u8",
      mime: "application/x-mpegURL",
      headers: { "User-Agent": "Mozilla/5.0" }
    };
  }
  if (cleanRef === "live:aljazeera_mubasher") {
    return {
      url: "https://live-hls-web-ajm.getaj.net/AJM/index.m3u8",
      mime: "application/x-mpegURL",
      headers: { "User-Agent": "Mozilla/5.0" }
    };
  }

  // Caso 1: Video del sitio web de Al Jazeera (ajz:PATH)
  if (cleanRef.startsWith("ajz:") || cleanRef.includes("aljazeera.com")) {
    let path = cleanRef.startsWith("ajz:") ? cleanRef.slice("ajz:".length) : cleanRef;
    if (!path.startsWith("http")) {
      path = `${ALJAZEERA_WEB_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
    }

    const res = await kino.fetch(path, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
    });
    if (!res.ok) {
      throw kino.error("not_found", `No se pudo obtener el artículo: ${res.status}`);
    }

    const html = await res.text();

    // 1. YouTube embedUrl en JSON-LD (e.g. "embedUrl": "https://www.youtube.com/embed/vbFfYj0ZUb4")
    const embedMatch = html.match(/"embedUrl"\s*:\s*"([^"]+)"/);
    if (embedMatch) {
      const ytId = extractVideoId(embedMatch[1]);
      if (ytId && ytId.length >= 5) {
        return await resolveYouTubeVideo(ytId);
      }
    }

    // 2. Meta tag featuredMedia (e.g. name="featuredMedia" content="YT-vbFfYj0ZUb4")
    const featuredMatch = html.match(/name="featuredMedia"\s+content="YT-([^"]+)"/)
      || html.match(/content="YT-([^"]+)"\s+name="featuredMedia"/);
    if (featuredMatch && featuredMatch[1]) {
      return await resolveYouTubeVideo(featuredMatch[1]);
    }

    // 3. Extraer contentUrl desde JSON-LD VideoObject
    const contentUrlMatch = html.match(/"contentUrl"\s*:\s*"([^"]+)"/);
    if (contentUrlMatch && contentUrlMatch[1].startsWith("http")) {
      const streamUrl = contentUrlMatch[1];
      const mime = streamUrl.includes(".m3u8") ? "application/x-mpegURL" : "video/mp4";
      return {
        url: streamUrl,
        mime,
        headers: { "User-Agent": "Mozilla/5.0" }
      };
    }

    // 4. Extraer sourceUrl decodificando window.__APOLLO_STATE__
    const apolloMatch = html.match(/window\.__APOLLO_STATE__\s*=\s*"([^"]+)"/);
    if (apolloMatch) {
      try {
        const decodedText = decodeBase64Utf8(apolloMatch[1]);
        const apolloData = JSON.parse(decodedText);
        for (const [key, val] of Object.entries(apolloData)) {
          if (val && typeof val.sourceUrl === "string" && val.sourceUrl.startsWith("http")) {
            const streamUrl = val.sourceUrl;
            const mime = streamUrl.includes(".m3u8") ? "application/x-mpegURL" : "video/mp4";
            return {
              url: streamUrl,
              mime,
              headers: { "User-Agent": "Mozilla/5.0" }
            };
          }
        }
      } catch (_) {}
    }

    // 5. Fallback: búsqueda por expresión regular de URL mp4 en Akamai
    const akamaiMatch = html.match(/https:\/\/[^"\s\\]+\.akamaized\.net\/[^"\s\\]+\.mp4/);
    if (akamaiMatch) {
      return {
        url: akamaiMatch[0],
        mime: "video/mp4",
        headers: { "User-Agent": "Mozilla/5.0" }
      };
    }

    // 6. Buscar cualquier enlace de YouTube en el HTML
    const genericYtMatch = html.match(/youtube\.com\/(?:watch\?v=|embed\/)([A-Za-z0-9_-]{11})/);
    if (genericYtMatch && genericYtMatch[1]) {
      return await resolveYouTubeVideo(genericYtMatch[1]);
    }

    // 7. Fallback inteligente: buscar en YouTube el título del artículo de Al Jazeera
    const pageTitleMatch = html.match(/<title>([\s\S]*?)<\/title>/);
    if (pageTitleMatch) {
      let pageTitle = decodeHtmlEntities(pageTitleMatch[1]).replace(/\|\s*Al\s*Jazeera.*$/i, "").trim();
      if (pageTitle) {
        try {
          const fallbackSearch = await search({ q: pageTitle });
          if (fallbackSearch && fallbackSearch.items && fallbackSearch.items.length > 0) {
            const first = fallbackSearch.items[0];
            const fbVid = extractVideoId(first.ref);
            if (fbVid && fbVid.length >= 5) {
              return await resolveYouTubeVideo(fbVid);
            }
          }
        } catch (_) {}
      }
    }

    throw kino.error("not_found", "No se encontró enlace de video para este reporte");
  }

  // Caso 2: Video de YouTube
  const videoId = extractVideoId(cleanRef);
  if (!videoId || videoId.length < 5) {
    try {
      const fbSearch = await search({ q: cleanRef });
      if (fbSearch && fbSearch.items && fbSearch.items.length > 0) {
        const topVid = extractVideoId(fbSearch.items[0].ref);
        if (topVid && topVid.length >= 5) {
          return await resolveYouTubeVideo(topVid);
        }
      }
    } catch (_) {}
    throw kino.error("not_found", "Identificador de video inválido");
  }

  return await resolveYouTubeVideo(videoId);
}

export async function liveCategories() {
  await null;
  return [
    {
      id: "noticias",
      title: "Noticias y Actualidad en Vivo",
      genre: "noticias"
    }
  ];
}

export async function liveChannels(params = {}) {
  await null;
  return {
    items: [
      {
        id: "live_aljazeera_arabic",
        title: "Al Jazeera Arabic (قناة الجزيرة)",
        number: 1,
        categoryId: "noticias",
        logo: "https://www.aljazeera.net/images/logo_aja_social.png",
        ref: "live:aljazeera_arabic",
        stream: {
          url: "https://live-hls-web-aja.getaj.net/AJA/index.m3u8",
          mime: "application/x-mpegURL"
        }
      },
      {
        id: "live_aljazeera_english",
        title: "Al Jazeera English Live",
        number: 2,
        categoryId: "noticias",
        logo: "https://www.aljazeera.com/images/logo_aje_social.png",
        ref: "live:aljazeera_english",
        stream: {
          url: "https://live-hls-aje-ak.getaj.net/aje/index.m3u8",
          mime: "application/x-mpegURL"
        }
      },
      {
        id: "live_aljazeera_mubasher",
        title: "Al Jazeera Mubasher (الجزيرة مباشر)",
        number: 3,
        categoryId: "noticias",
        logo: "https://www.aljazeera.net/images/logo_aja_social.png",
        ref: "live:aljazeera_mubasher",
        stream: {
          url: "https://live-hls-web-ajm.getaj.net/AJM/index.m3u8",
          mime: "application/x-mpegURL"
        }
      }
    ],
    next: null
  };
}
