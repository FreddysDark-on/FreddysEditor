// =======================================================
// Descarga mis estadísticas y clientes de YT Jobs y los guarda
// en data/ytjobs.json (lo corre el GitHub Action cada 6 horas).
// Uso local:  node scripts/update-ytjobs.mjs
// =======================================================
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const TALENT_ID = '437788';
const API_URL = `https://app.ytjobs.co/api/talents/${TALENT_ID}?showAll=true`;
const OUT_FILE = join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'ytjobs.json');

// "487.4K" -> 487400
function parseAbv(text) {
    if (text == null) return null;
    const match = String(text).trim().match(/^([\d.,]+)\s*([KMB]?)$/i);
    if (!match) return null;
    const mult = { '': 1, K: 1e3, M: 1e6, B: 1e9 }[match[2].toUpperCase()];
    return Math.round(parseFloat(match[1].replace(/,/g, '')) * mult);
}

const res = await fetch(API_URL, { headers: { 'User-Agent': 'Mozilla/5.0 (FreddysEditor stats bot)' } });
if (!res.ok) throw new Error(`YT Jobs respondió ${res.status}`);
const data = await res.json();

const yt = data.youtubeVideos;
if (!yt || !yt.statistics || !Array.isArray(yt.channels)) throw new Error('Formato inesperado de YT Jobs');

const clients = yt.channels
    .map(ch => ({
        id: ch.id,
        name: ch.name,
        avatar: ch.avatar,
        subscribers: ch.subscribers,
        link: ch.company?.ytLink || null,
        verified: ch.status === 'verified'
    }))
    .sort((a, b) => b.subscribers - a.subscribers);

const next = {
    source: `https://ytjobs.co/talent/profile/${TALENT_ID}`,
    stats: {
        views: yt.statistics.views,
        videos: yt.statistics.counts,
        likes: parseAbv(yt.statistics.abvLikes),
        comments: parseAbv(yt.statistics.abvComments),
        clients: clients.length,
        clientSubscribers: clients.reduce((sum, c) => sum + (c.subscribers || 0), 0)
    },
    clients
};

// Solo tocamos el archivo (y la fecha) si cambió algo, así no hay commits vacíos
let prev = null;
try { prev = JSON.parse(await readFile(OUT_FILE, 'utf8')); } catch { }
const { updatedAt: _, ...prevData } = prev || {};

if (JSON.stringify(prevData) === JSON.stringify(next)) {
    console.log('Sin cambios en YT Jobs.');
} else {
    await mkdir(dirname(OUT_FILE), { recursive: true });
    await writeFile(OUT_FILE, JSON.stringify({ updatedAt: new Date().toISOString(), ...next }, null, 2) + '\n');
    console.log('data/ytjobs.json actualizado:', next.stats);
}
