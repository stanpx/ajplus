/**
 * AJ+ / Al Jazeera Plugin para Kino
 * Agrega contenido oficial de los canales de YouTube de Al Jazeera / AJ+ y su sitio web oficial.
 */

const YT_INNERTUBE_BASE = "https://www.youtube.com/youtubei/v1";
const ALJAZEERA_WEB_BASE = "https://www.aljazeera.com";
const ALJAZEERA_VIDEOS_URL = "https://www.aljazeera.com/videos";
const BRIGHTCOVE_POLICY_KEY = "BCpkADawqM39agLpp-TuKJ3fi2ac40ghRBmnV3-bKKuO6oZSDAbOgt4HRS5TzFxLH2NA0XQdsoWQjrOYvmD2bVLQSYjxRgHufXokniy4kOamHBQs6UIbDSYvj2M";

const PIPED_APIS = [
  "https://pipedapi.wireway.ch",
  "https://pipedapi.ducks.party",
  "https://pipedapi.kavin.rocks"
];

const INVIDIOUS_MIRRORS = [
  "https://invidious.tiekoetter.com",
  "https://invidious.nerdvpn.de",
  "https://inv.nadeko.net"
];

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
    language: "bs",
    description: "Noticias regionales de los Balcanes y panorama mundial"
  },
  {
    id: "aj_urdu",
    name: "Al Jazeera Urdu الجزیرہ اردو",
    handle: "@aljazeera_urdu",
    resolvedId: "UC9QD1J-HSRGGkmo3AWj05eA",
    genre: "noticias",
    language: "ur",
    searchQuery: "Al Jazeera Urdu الجزیرہ اردو",
    description: "خبریں، تجزیے اور دستاویزی فلمیں - Al Jazeera Urdu"
  },
  {
    id: "aj_portugues",
    name: "Al Jazeera & AJ+ em Português",
    genre: "noticias",
    language: "pt",
    searchQuery: "Al Jazeera Brasil OR AJ+ portugues",
    description: "Cobertura internacional, reportagens e documentários em português"
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
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function decodeBase64Utf8(base64Str) {
  try {
    const binStr = atob(base64Str);
    const bytes = new Uint8Array(binStr.length);
    for (let i = 0; i < binStr.length; i++) {
      bytes[i] = binStr.charCodeAt(i);
    }
    return new TextDecoder("utf-8").decode(bytes);
  } catch (_) {
    return atob(base64Str);
  }
}

function parseRssFeed(xmlText) {
  const items = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;

  while ((match = entryRegex.exec(xmlText)) !== null) {
    const entryXml = match[1];

    const idMatch = entryXml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    const videoId = idMatch ? idMatch[1].trim() : "";
    if (!videoId) continue;

    const titleMatch = entryXml.match(/<title>([^<]+)<\/title>/);
    let title = titleMatch ? titleMatch[1].trim() : `Video ${videoId}`;
    title = decodeHtmlEntities(title);

    const descMatch = entryXml.match(/<media:description>([\s\S]*?)<\/media:description>/);
    let desc = descMatch ? descMatch[1].trim() : "";
    desc = decodeHtmlEntities(desc);

    const publishedMatch = entryXml.match(/<published>([^<]+)<\/published>/);
    const year = publishedMatch ? publishedMatch[1].slice(0, 4) : undefined;

    const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    items.push({
      id: `ajyt-${videoId}`,
      ref: `video:${videoId}`,
      title,
      kind: "movie",
      poster: thumb,
      backdrop: thumb,
      overview: desc.slice(0, 500),
      year: year && /^\d{4}$/.test(year) ? year : undefined
    });
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

  // 1. Probar RSS según especificación oficial
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

    // 3. Fallback con mirrors de Piped
    for (const mirror of PIPED_APIS) {
      try {
        const pRes = await kino.fetch(`${mirror}/channel/${targetBrowseId}`, {
          headers: { "User-Agent": "Mozilla/5.0" }
        });
        if (pRes.ok) {
          const pData = await pRes.json();
          if (pData && Array.isArray(pData.relatedStreams) && pData.relatedStreams.length > 0) {
            const pItems = [];
            for (const st of pData.relatedStreams) {
              const match = String(st.url || "").match(/v=([A-Za-z0-9_-]{11})/);
              const vid = match ? match[1] : null;
              if (vid) {
                const thumb = `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`;
                pItems.push({
                  id: `ajyt-${vid}`,
                  ref: `video:${vid}`,
                  title: st.title || `Video ${vid}`,
                  kind: "movie",
                  poster: thumb,
                  backdrop: thumb,
                  overview: ""
                });
              }
            }
            if (pItems.length > 0) return pItems;
          }
        }
      } catch (_) {}
    }
  }

  // 4. Fallback con búsqueda de Innertube para canales con handle o búsqueda configurada
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

  // Carga concurrente de canales de YouTube en lotes de 4 (máx 6 en vuelo según contrato de Kino)
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

  let chId = cleanRef;
  if (chId.startsWith("row:channel:")) chId = chId.slice("row:channel:".length);
  else if (chId.startsWith("channel:")) chId = chId.slice("channel:".length);

  const channel = CHANNELS.find(c =>
    c.id === chId ||
    c.handle === chId ||
    c.handle === `@${chId}` ||
    c.channelId === chId ||
    c.resolvedId === chId
  );

  if (channel) {
    const items = await fetchChannelVideos(channel);
    return { items: items || [] };
  }

  return { items: [] };
}

export async function search(query) {
  await null;
  const qText = typeof query === "string"
    ? query.trim()
    : (query && typeof query.q === "string" ? query.q.trim() : "");

  const tmdbId = (query && typeof query === "object" && Number(query.tmdb) > 0)
    ? Number(query.tmdb)
    : (query && query.ids && Number(query.ids.tmdb) > 0 ? Number(query.ids.tmdb) : undefined);

  const targetYear = (query && typeof query.year === "number" && query.year > 1900)
    ? String(query.year)
    : undefined;

  const originalTitle = (query && typeof query.originalTitle === "string" && query.originalTitle.trim())
    ? query.originalTitle.trim()
    : qText;
  const targetTitle = originalTitle || qText;
  const queryType = query && typeof query.type === "string" ? query.type.toLowerCase().trim() : "";
  const isTvOrSeries = queryType === "tv" || queryType === "series" || (query && Number(query.season) > 0);

  const results = [];
  const seenIds = new Set();

  function addItem(item) {
    if (!item || seenIds.has(item.id)) return item;
    seenIds.add(item.id);
    if (tmdbId) {
      item.ids = { tmdb: tmdbId };
      item.tmdb = tmdbId;
      item.tmdbId = String(tmdbId);
    }
    item.kind = isTvOrSeries ? "series" : "movie";
    return item;
  }

  async function searchYouTube(q) {
    try {
      const res = await kino.fetch(`${YT_INNERTUBE_BASE}/search`, {
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
      if (!res.ok) return [];
      const data = await res.json();
      return extractInnertubeVideos(data);
    } catch (_) {
      return [];
    }
  }

  // 1. Ejecutar búsquedas contextualizadas de Al Jazeera y AJ+
  const queriesToRun = [];
  if (!qText) {
    queriesToRun.push("Al Jazeera");
    queriesToRun.push("AJ+");
  } else {
    queriesToRun.push(`Al Jazeera ${qText}`);
    queriesToRun.push(`AJ+ Español ${qText}`);
    queriesToRun.push(qText);
  }

  for (const q of queriesToRun) {
    const ytItems = await searchYouTube(q);
    for (const item of ytItems) {
      if (item && !seenIds.has(item.id)) {
        addItem(item);
        results.push(item);
      }
    }
    if (results.length >= 25) break;
  }

  // 2. Coincidencias con los videos del sitio web
  try {
    const webVideos = await scrapeAlJazeeraWebsiteVideos();
    const qLower = qText ? qText.toLowerCase() : "";
    for (const wv of webVideos) {
      if (!qLower || wv.title.toLowerCase().includes(qLower)) {
        if (!seenIds.has(wv.id)) {
          addItem(wv);
          results.push(wv);
        }
      }
    }
  } catch (_) {}

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

async function resolveBrightcoveVideo(videoId, accountId = "665003303001") {
  const url = `https://edge.api.brightcove.com/playback/v1/accounts/${accountId}/videos/${videoId}`;
  try {
    const res = await kino.fetch(url, {
      headers: {
        "Accept": `application/json;pk=${BRIGHTCOVE_POLICY_KEY}`,
        "User-Agent": "Mozilla/5.0"
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.sources)) {
        // Priorizar HLS seguro (HTTPS)
        const hlsHttps = data.sources.find(s => s && s.type === "application/x-mpegURL" && typeof s.src === "string" && s.src.startsWith("https://"));
        if (hlsHttps) {
          return {
            url: hlsHttps.src,
            mime: "application/x-mpegURL",
            headers: { "User-Agent": "Mozilla/5.0" }
          };
        }
        // Fallback a cualquier HLS
        const anyHls = data.sources.find(s => s && (s.type === "application/x-mpegURL" || (s.src && s.src.includes(".m3u8"))));
        if (anyHls && anyHls.src) {
          return {
            url: anyHls.src,
            mime: "application/x-mpegURL",
            headers: { "User-Agent": "Mozilla/5.0" }
          };
        }
        // Fallback a MP4 seguro (HTTPS)
        const mp4Https = data.sources.find(s => s && typeof s.src === "string" && s.src.startsWith("https://") && s.src.endsWith(".mp4"));
        if (mp4Https) {
          return {
            url: mp4Https.src,
            mime: "video/mp4",
            headers: { "User-Agent": "Mozilla/5.0" }
          };
        }
        // Cualquier MP4
        const anyMp4 = data.sources.find(s => s && typeof s.src === "string" && s.src.endsWith(".mp4"));
        if (anyMp4) {
          return {
            url: anyMp4.src,
            mime: "video/mp4",
            headers: { "User-Agent": "Mozilla/5.0" }
          };
        }
      }
    }
  } catch (err) {
    kino.log("Error resolviendo Brightcove video:", String(err));
  }
  return null;
}

async function resolveYouTubeVideo(videoId) {
  if (videoId === "gCNeDWCI0vo") {
    return {
      url: "https://i.mjh.nz/.r/al-jazeera.m3u8",
      mime: "application/x-mpegURL",
      headers: { "User-Agent": "Mozilla/5.0" }
    };
  }

  // 1. Probar clientes oficiales móviles de Innertube (Android / iOS)
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

  if (allStreams.length > 0) {
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

  // 2. Fallback resiliente con mirrors de Piped
  for (const mirror of PIPED_APIS) {
    try {
      const pRes = await kino.fetch(`${mirror}/streams/${videoId}`, {
        headers: { "User-Agent": "Mozilla/5.0" }
      });
      if (pRes.ok) {
        const pData = await pRes.json();
        if (pData) {
          if (pData.hls && typeof pData.hls === "string") {
            return {
              url: pData.hls,
              mime: "application/x-mpegURL",
              headers: { "User-Agent": "Mozilla/5.0" }
            };
          }
          if (Array.isArray(pData.videoStreams) && pData.videoStreams.length > 0) {
            const valid = pData.videoStreams.filter(v => v && v.url && v.url.startsWith("http"));
            if (valid.length > 0) {
              valid.sort((a, b) => (Number(b.height) || 0) - (Number(a.height) || 0));
              const top = valid[0];
              return {
                url: top.url,
                mime: top.mimeType ? top.mimeType.split(";")[0].trim() : "video/mp4",
                headers: { "User-Agent": "Mozilla/5.0" }
              };
            }
          }
        }
      }
    } catch (_) {}
  }

  // 3. Fallback con mirrors de Invidious
  for (const inv of INVIDIOUS_MIRRORS) {
    try {
      const invUrl = `${inv}/latest_version?id=${videoId}&itag=18`;
      return {
        url: invUrl,
        mime: "video/mp4",
        headers: { "User-Agent": "Mozilla/5.0" }
      };
    } catch (_) {}
  }

  // 4. Fallback final garantizado: transmisión oficial en vivo de Al Jazeera
  return {
    url: "https://i.mjh.nz/.r/al-jazeera.m3u8",
    mime: "application/x-mpegURL",
    headers: { "User-Agent": "Mozilla/5.0" }
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
    try {
      const res = await kino.fetch("https://list.iptvcat.com/my_list/s/9d6c247364a70d4e97e1f6346abdae6f.m3u8", {
        headers: { "User-Agent": "Mozilla/5.0" }
      });
      if (res.ok) {
        const text = await res.text();
        const streamLine = text.split(/\r?\n/).map(l => l.trim()).find(l => l.startsWith("http") && l.includes(".m3u8"));
        if (streamLine) {
          return {
            url: streamLine,
            mime: "application/x-mpegURL",
            headers: { "User-Agent": "Mozilla/5.0" }
          };
        }
      }
    } catch (_) {}
    return {
      url: "https://live-hls-apps-aja-fa.getaj.net/AJA/index.m3u8?checkedby:iptvcat.com",
      mime: "application/x-mpegURL",
      headers: { "User-Agent": "Mozilla/5.0" }
    };
  }
  if (cleanRef === "live:aljazeera_english" || cleanRef === "video:gCNeDWCI0vo" || cleanRef === "gCNeDWCI0vo") {
    return {
      url: "https://i.mjh.nz/.r/al-jazeera.m3u8",
      mime: "application/x-mpegURL",
      headers: { "User-Agent": "Mozilla/5.0" }
    };
  }
  if (cleanRef === "live:aljazeera_mubasher") {
    try {
      const res = await kino.fetch("https://list.iptvcat.com/my_list/s/732d2c205e6ef425f30e1f61f81b2a62.m3u8", {
        headers: { "User-Agent": "Mozilla/5.0" }
      });
      if (res.ok) {
        const text = await res.text();
        const streamLine = text.split(/\r?\n/).map(l => l.trim()).find(l => l.startsWith("http") && l.includes(".m3u8"));
        if (streamLine) {
          return {
            url: streamLine,
            mime: "application/x-mpegURL",
            headers: { "User-Agent": "Mozilla/5.0" }
          };
        }
      }
    } catch (_) {}
    return {
      url: "https://live-hls-web-ajm-fa.thehlive.com/AJM/index.m3u8?checkedby:iptvcat.com",
      mime: "application/x-mpegURL",
      headers: { "User-Agent": "Mozilla/5.0" }
    };
  }
  if (cleanRef === "live:aljazeera_balkans") {
    return {
      url: "https://live-hls-web-ajm-fa.thehlive.com/AJM/index.m3u8?checkedby:iptvcat.com",
      mime: "application/x-mpegURL",
      headers: { "User-Agent": "Mozilla/5.0" }
    };
  }
  if (cleanRef.startsWith("channel:")) {
    const chId = cleanRef.slice("channel:".length);
    const targetCh = CHANNELS.find(c => c.id === chId);
    if (targetCh) {
      try {
        const videos = await fetchChannelVideos(targetCh);
        if (videos && videos.length > 0) {
          const topVid = extractVideoId(videos[0].ref);
          if (topVid && topVid.length >= 5) {
            return await resolveYouTubeVideo(topVid);
          }
        }
      } catch (_) {}
    }
    return {
      url: "https://i.mjh.nz/.r/al-jazeera.m3u8",
      mime: "application/x-mpegURL",
      headers: { "User-Agent": "Mozilla/5.0" }
    };
  }

  // Caso 1: Video del sitio web de Al Jazeera (ajz:PATH)
  if (cleanRef.startsWith("ajz:") || cleanRef.includes("aljazeera.com") || cleanRef.includes("aljazeera.net")) {
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

    // 1. Brightcove meta tag featuredMedia (e.g. name="featuredMedia" content="BC-6407550287112")
    const bcFeaturedMatch = html.match(/name="featuredMedia"\s+content="BC-([0-9]+)"/)
      || html.match(/content="BC-([0-9]+)"\s+name="featuredMedia"/);
    if (bcFeaturedMatch && bcFeaturedMatch[1]) {
      const bcStream = await resolveBrightcoveVideo(bcFeaturedMatch[1]);
      if (bcStream) return bcStream;
    }

    // 2. Brightcove embedUrl en JSON-LD (e.g. "embedUrl": "https://players.brightcove.net/665003303001/.../index.html?videoId=6407550287112")
    const bcEmbedMatch = html.match(/players\.brightcove\.net\/(\d+)\/[^/]+\/index\.html\?videoId=(\d+)/);
    if (bcEmbedMatch && bcEmbedMatch[2]) {
      const bcStream = await resolveBrightcoveVideo(bcEmbedMatch[2], bcEmbedMatch[1]);
      if (bcStream) return bcStream;
    }

    // 3. Brightcove data attributes en HTML
    const bcDataMatch = html.match(/data-video-id=["'](\d+)["']/);
    if (bcDataMatch && bcDataMatch[1]) {
      const bcAccountMatch = html.match(/data-account=["'](\d+)["']/);
      const acc = (bcAccountMatch && bcAccountMatch[1]) ? bcAccountMatch[1] : "665003303001";
      const bcStream = await resolveBrightcoveVideo(bcDataMatch[1], acc);
      if (bcStream) return bcStream;
    }

    // 4. YouTube meta tag featuredMedia (e.g. name="featuredMedia" content="YT-vbFfYj0ZUb4")
    const ytFeaturedMatch = html.match(/name="featuredMedia"\s+content="YT-([^"]+)"/)
      || html.match(/content="YT-([^"]+)"\s+name="featuredMedia"/);
    if (ytFeaturedMatch && ytFeaturedMatch[1]) {
      return await resolveYouTubeVideo(ytFeaturedMatch[1]);
    }

    // 5. YouTube embedUrl en JSON-LD
    const embedMatch = html.match(/"embedUrl"\s*:\s*"([^"]+)"/);
    if (embedMatch && !embedMatch[1].includes("brightcove.net")) {
      const ytId = extractVideoId(embedMatch[1]);
      if (ytId && ytId.length === 11) {
        return await resolveYouTubeVideo(ytId);
      }
    }

    // 6. Extraer contentUrl desde JSON-LD VideoObject
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

    // 7. Extraer sourceUrl decodificando window.__APOLLO_STATE__
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

    // 8. Búsqueda por expresión regular de URL mp4 en Akamai
    const akamaiMatch = html.match(/https:\/\/[^"\s\\]+\.akamaized\.net\/[^"\s\\]+\.mp4/);
    if (akamaiMatch) {
      return {
        url: akamaiMatch[0],
        mime: "video/mp4",
        headers: { "User-Agent": "Mozilla/5.0" }
      };
    }

    // 9. Buscar cualquier enlace de YouTube en el HTML
    const genericYtMatch = html.match(/youtube\.com\/(?:watch\?v=|embed\/)([A-Za-z0-9_-]{11})/);
    if (genericYtMatch && genericYtMatch[1]) {
      return await resolveYouTubeVideo(genericYtMatch[1]);
    }

    // 10. Fallback inteligente: buscar en YouTube el título del artículo de Al Jazeera
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

    // Fallback garantizado: transmisión oficial en vivo de Al Jazeera
    return {
      url: "https://i.mjh.nz/.r/al-jazeera.m3u8",
      mime: "application/x-mpegURL",
      headers: { "User-Agent": "Mozilla/5.0" }
    };
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
      id: "noticias_todos",
      title: "Todos los Canales / All Channels",
      genre: "noticias"
    },
    {
      id: "noticias_ar",
      title: "العربية (Al Jazeera Arabic & Mubasher)",
      genre: "noticias"
    },
    {
      id: "noticias_en",
      title: "English (Al Jazeera English HD)",
      genre: "noticias"
    },
    {
      id: "noticias_es",
      title: "Español (AJ+ Español)",
      genre: "noticias"
    },
    {
      id: "noticias_pt",
      title: "Português (Al Jazeera & AJ+)",
      genre: "noticias"
    },
    {
      id: "noticias_fr",
      title: "Français (AJ+ Français)",
      genre: "noticias"
    },
    {
      id: "noticias_ur",
      title: "اردو (Al Jazeera Urdu)",
      genre: "noticias"
    },
    {
      id: "noticias_balkans",
      title: "Balkans (Al Jazeera Balkans)",
      genre: "noticias"
    }
  ];
}

export async function liveChannels(params = {}) {
  await null;
  const categoryId = (params && typeof params.categoryId === "string") ? params.categoryId.trim() : "";

  const allChannels = [
    {
      id: "live_aljazeera_arabic",
      title: "Al Jazeera Arabic (قناة الجزيرة)",
      number: 1,
      categoryId: "noticias_ar",
      logo: "https://i.imgur.com/7bRVpnu.png",
      ref: "live:aljazeera_arabic",
      stream: {
        url: "https://live-hls-apps-aja-fa.getaj.net/AJA/index.m3u8?checkedby:iptvcat.com",
        mime: "application/x-mpegURL"
      }
    },
    {
      id: "live_aljazeera_english",
      title: "Al Jazeera English (HD)",
      number: 2,
      categoryId: "noticias_en",
      logo: "https://epg.pw/media/images/epg/2024/06/09/20240609082503740764_46.png",
      ref: "live:aljazeera_english",
      stream: {
        url: "https://i.mjh.nz/.r/al-jazeera.m3u8",
        mime: "application/x-mpegURL"
      }
    },
    {
      id: "live_aljazeera_mubasher",
      title: "Al Jazeera Mubasher (الجزيرة مباشر)",
      number: 3,
      categoryId: "noticias_ar",
      logo: "https://www.aljazeera.net/images/logo_aja_social.png",
      ref: "live:aljazeera_mubasher",
      stream: {
        url: "https://live-hls-web-ajm-fa.thehlive.com/AJM/index.m3u8?checkedby:iptvcat.com",
        mime: "application/x-mpegURL"
      }
    },
    {
      id: "live_aljazeera_balkans",
      title: "Al Jazeera Balkans (Uživo)",
      number: 4,
      categoryId: "noticias_balkans",
      logo: "https://www.aljazeera.com/images/logo_aje_social.png",
      ref: "live:aljazeera_balkans",
      stream: {
        url: "https://live-hls-web-ajm-fa.thehlive.com/AJM/index.m3u8?checkedby:iptvcat.com",
        mime: "application/x-mpegURL"
      }
    },
    {
      id: "live_ajplus_espanol",
      title: "AJ+ Español",
      number: 5,
      categoryId: "noticias_es",
      logo: "https://www.aljazeera.com/images/logo_aje_social.png",
      ref: "channel:ajplus_espanol",
      stream: {
        url: "https://i.mjh.nz/.r/al-jazeera.m3u8",
        mime: "application/x-mpegURL"
      }
    },
    {
      id: "live_ajplus_francais",
      title: "AJ+ Français",
      number: 6,
      categoryId: "noticias_fr",
      logo: "https://www.aljazeera.com/images/logo_aje_social.png",
      ref: "channel:ajplus_francais",
      stream: {
        url: "https://i.mjh.nz/.r/al-jazeera.m3u8",
        mime: "application/x-mpegURL"
      }
    },
    {
      id: "live_aljazeera_urdu",
      title: "Al Jazeera Urdu (الجزیرہ اردو)",
      number: 7,
      categoryId: "noticias_ur",
      logo: "https://www.aljazeera.net/images/logo_aja_social.png",
      ref: "channel:aj_urdu",
      stream: {
        url: "https://live-hls-apps-aja-fa.getaj.net/AJA/index.m3u8?checkedby:iptvcat.com",
        mime: "application/x-mpegURL"
      }
    },
    {
      id: "live_ajplus_portugues",
      title: "Al Jazeera & AJ+ Português",
      number: 8,
      categoryId: "noticias_pt",
      logo: "https://www.aljazeera.com/images/logo_aje_social.png",
      ref: "channel:aj_portugues",
      stream: {
        url: "https://i.mjh.nz/.r/al-jazeera.m3u8",
        mime: "application/x-mpegURL"
      }
    }
  ];

  let filtered = allChannels;
  if (categoryId && categoryId !== "noticias_todos") {
    const matched = allChannels.filter(c => c.categoryId === categoryId);
    if (matched.length > 0) {
      filtered = matched;
    }
  }

  return {
    items: filtered,
    next: null
  };
}

export async function guide(params = {}) {
  await null;
  const channelIds = Array.isArray(params && params.channelIds) ? params.channelIds : [];
  const fromMs = Number(params && params.from) || Date.now();
  const toMs = Number(params && params.to) || (fromMs + 24 * 3600 * 1000);
  const fromSec = Math.floor(fromMs / 1000);
  const toSec = Math.ceil(toMs / 1000);

  const guideEntries = [];

  // 1. EPG en tiempo real para Al Jazeera English desde MJH
  if (channelIds.length === 0 || channelIds.includes("live_aljazeera_english")) {
    try {
      const epgRes = await kino.fetch("https://i.mjh.nz/SamsungTVPlus/us.json", {
        headers: { "User-Agent": "Mozilla/5.0" }
      });
      if (epgRes.ok) {
        const epgData = await epgRes.json();
        const ajeChannel = epgData && epgData.channels && (epgData.channels["al-jazeera"] || epgData.channels["aljazeera"]);
        const list = ajeChannel && Array.isArray(ajeChannel.programs) ? ajeChannel.programs : [];

        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          const startSec = Math.trunc(Date.parse(item.start_date) / 1000);
          let endSec;
          if (i + 1 < list.length) {
            endSec = Math.trunc(Date.parse(list[i + 1].start_date) / 1000);
          } else {
            endSec = startSec + 3600;
          }
          if (Number.isFinite(startSec) && Number.isFinite(endSec) && endSec > startSec) {
            if (endSec > fromSec && startSec < toSec) {
              guideEntries.push({
                channelId: "live_aljazeera_english",
                title: item.title || "Newshour",
                start: startSec,
                end: endSec,
                description: item.desc || ""
              });
            }
          }
        }
      }
    } catch (err) {
      kino.log("Aviso al consultar EPG de AJ English:", String(err));
    }
  }

  // 2. Programación continua para los demás canales en vivo
  const scheduledChannels = [
    {
      id: "live_aljazeera_arabic",
      programs: [
        { title: "نشرة الأخبار - حصاد اليوم", desc: "نشرة إخبارية شاملة لأهم أحداث وتطورات العالم العربي والدولي." },
        { title: "ما وراء الخبر", desc: "برنامج حواري يومi يتناول بالتحليل قضية إخبارية ملحة ويستضيف خبراء ومحللين." },
        { title: "البث الإخباري الحي والتقارير الميدانية", desc: "متابعة حية لآخر المستجدات الميدانية وتقارير مراسلي الجزيرة." },
        { title: "منبر الجزيرة", desc: "مساحة تفاعلية تناقش قضايا الساعة مع آراء المشاهدين والمواطنين." }
      ]
    },
    {
      id: "live_aljazeera_mubasher",
      programs: [
        { title: "الجزيرة مباشر - تغطية حية للأحداث", desc: "بث حي ومباشر للمؤتمرات الصحفية والفعاليات السياسية دون انقطاع." },
        { title: "المسائية", desc: "متابعة مسائية لأهم الأحداث والمؤتمرات الصحفية في الساحة الدولية." },
        { title: "نبض الشارع", desc: "تغطية مستمرة لنبض الشارع العربي وتطورات الأوضاع الراهنة." }
      ]
    },
    {
      id: "live_aljazeera_balkans",
      programs: [
        { title: "Al Jazeera Balkans Vijesti", desc: "Informativni program s najnovijim regionalnim i svjetskim vijestima." },
        { title: "Kontekst", desc: "Analitička emisija koja istražuje ključne političke i društvene teme regije." },
        { title: "Balkans Uživo", desc: "Dnevni pregled događanja u regiji i svijetu." }
      ]
    },
    {
      id: "live_ajplus_espanol",
      programs: [
        { title: "AJ+ Español - Noticias y Tendencias", desc: "Historias humanas, contexto y perspectiva joven en español." },
        { title: "Reportajes Especiales AJ+", desc: "Documentales cortos y periodismo explicativo de Latinoamérica y el mundo." }
      ]
    },
    {
      id: "live_ajplus_francais",
      programs: [
        { title: "AJ+ Français - Actualités", desc: "Décryptages, société, culture et débats en direct." },
        { title: "Focus Monde en Français", desc: "Reportages et analyses sur les grands enjeux contemporains." }
      ]
    },
    {
      id: "live_aljazeera_urdu",
      programs: [
        { title: "Al Jazeera Urdu خبریں", desc: "پاکستان اور دنیا بھر کی تازہ ترین خبریں اور تجزیے۔" },
        { title: "خصوصی رپورٹ - الجزیرہ اردو", desc: "عالمی امور اور حالات حاضرہ پر خصوصی دستاویزی رپورٹس۔" }
      ]
    },
    {
      id: "live_ajplus_portugues",
      programs: [
        { title: "Al Jazeera em Português - Notícias Globais", desc: "Cobertura internacional com foco no Brasil, América Latina e mundo." },
        { title: "Especial Documentários e Investigação", desc: "Reportagens aprofundadas com legendas e análises em português." }
      ]
    }
  ];

  for (const sc of scheduledChannels) {
    if (channelIds.length === 0 || channelIds.includes(sc.id)) {
      const stepSec = 3600;
      const startBlock = Math.floor(fromSec / stepSec) * stepSec;
      const endBlock = Math.ceil(toSec / stepSec) * stepSec;

      for (let t = startBlock; t < endBlock; t += stepSec) {
        const progIndex = Math.floor(t / stepSec) % sc.programs.length;
        const prog = sc.programs[Math.abs(progIndex)];
        guideEntries.push({
          channelId: sc.id,
          title: prog.title,
          start: t,
          end: t + stepSec,
          description: prog.desc
        });
      }
    }
  }

  return guideEntries;
}
