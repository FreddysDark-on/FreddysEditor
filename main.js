// =======================================================
// --- 1. BASE DE DATOS DE TUS VIDEOS ---
// =======================================================
const misVideos = {
    basic: {
        horizontal: {
            gameplay: [
                "https://www.youtube.com/watch?v=FuB2WmA8lQQ&t", 
                "https://www.youtube.com/watch?v=XPyRkFX3oqg&t", 
                "https://www.youtube.com/watch?v=z7cUJdhe6jo&t", 
                "https://www.youtube.com/watch?v=6XnbJFwk840"
            ],
            vlogs: [
                "https://www.youtube.com/watch?v=2KeFkFTDbxc&t", 
                "https://www.youtube.com/watch?v=O8M6ws55YwM&t", 
                "https://www.youtube.com/watch?v=yQVcPLd_rs8&t", 
                "https://www.youtube.com/watch?v=dncoPRb6C2Q"
            ],
            terror: ["", "", "", ""],
            other: [
                "https://www.youtube.com/watch?v=q6EB0VFBxD0&t", 
                "https://www.youtube.com/watch?v=_fTfs2QRz9Y", 
                "https://www.youtube.com/watch?v=5Fvnmtjk_ng&t", 
                "https://www.youtube.com/watch?v=4MW9vLEEAT8&t",
                "https://www.youtube.com/watch?v=rgn_X_09z0E&t",
                "https://www.youtube.com/watch?v=p4VEgWzj2iA"
            ]
        },
        vertical: {
            gameplay: [
                "https://www.tiktok.com/@frannight5/video/7633423425079463189?_r=1&_t=ZS-95q071ThbUb",
                "https://www.tiktok.com/@frannight5/video/7633938789148495124?_r=1&_t=ZS-95q071ThbUb", 
                "https://www.tiktok.com/@frannight5/video/7633045501520153876?_r=1&_t=ZS-95q071ThbUb", 
                "https://youtube.com/shorts/yqppCMTW-dE" 
            ],
            vlogs: [
                "https://www.youtube.com/shorts/7zrsmDm6Tjo", 
                "", "", ""
            ],
            terror: [
                "https://youtube.com/shorts/j92-7WlkM4c", 
                "", "", ""
            ],
            other: [
                 "https://www.tiktok.com/@frannight5/video/7633128143921941780?_r=1&_t=ZS-95q071ThbUb",
                 "https://www.tiktok.com/@frannight5/video/7635278463955422485?_r=1&_t=ZS-95q071ThbUb",
                 "https://www.tiktok.com/@frannight5/video/7634195180895194388?_r=1&_t=ZS-95q071ThbUb",
                 "https://www.youtube.com/shorts/1p1ZeeiVRvQ"
            ]
        }
    },
    standard: {
        horizontal: {
            gameplay: ["", "", "", ""],
            vlogs: ["https://www.youtube.com/watch?v=aK0RhImYEq0&t", "", "", ""],
            terror: ["", "", "", ""],
            other: [
                "https://www.youtube.com/watch?v=Nr0oqcXib9Q", 
                "https://www.youtube.com/watch?v=I08PYkhi8Lg"
            ]
        },
        vertical: {
            gameplay: ["", "", "", ""],
            vlogs: ["", "", "", ""],
            terror: ["", "", "", ""],
            other: [
                "https://www.tiktok.com/@frannight5/video/7632712154533186837?_r=1&_t=ZS-95q071ThbUb",
                 "https://youtube.com/shorts/f2h2eibA4v4",
                 "", ""
            ]
        }
    }
};

const infoPrecios = {
    horizontal: {
        basic: {
            precio: "",
            tarifa: "",
            ventajas: [
                "Basic transitions", 
                "Zooms", 
                "Subtitles", 
                "Basic Sound Effects", 
                "1-2 days delivery", 
                "3 Revisions"
            ]
        },
        standard: {
            precio: "",
            tarifa: "",
            ventajas: [
                "Everything above", 
                "Better Sound Effects", 
                "2D + 3D Basic Motion Graphics", 
                "Graphics", 
                "1-6 days delivery", 
                "Unlimited Revisions"
            ]
        }
    },
    vertical: {
        basic: {
            precio: "",
            tarifa: "",
            ventajas: [
                "Basic transitions", 
                "Zooms", 
                "Subtitles", 
                "Basic Sound Effects", 
                "1-2 days delivery", 
                "3 Revisions"
            ]
        },
        standard: {
            precio: "",
            tarifa: "",
            ventajas: [
                "Everything above", 
                "Dynamic Music", 
                "2D + 3D Motion Graphics", 
                "Graphics", 
                "1-6 days delivery", 
                "Unlimited Revisions"
            ]
        }
    }
};


let planActual = 'basic'; 
let formatoActual = 'horizontal';
let categoriaActual = 'gameplay';
let renderId = 0;

function getYoutubeId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

async function getTikTokThumbnail(url) {
    try {
        const response = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`);
        if (!response.ok) return null;
        const data = await response.json();
        return data.thumbnail_url; 
    } catch (error) {
        console.error("Error API TikTok:", error);
        return null;
    }
}


async function renderVideos() {
    renderId++; 
    const idActual = renderId;
    
    const grid = document.getElementById('video-grid');
    grid.innerHTML = '<p style="color:#6B7280; grid-column: 1 / -1;">Loading...</p>'; 
    
    const linksCrudos = misVideos[planActual][formatoActual][categoriaActual] || [];
    const linksValidos = linksCrudos.filter(link => link !== "");

    if (linksValidos.length === 0) {
        if (idActual !== renderId) return;
        
        grid.innerHTML = '<p style="color:#6B7280; grid-column: 1 / -1; font-style: italic;">No examples available at the moment :(</p>';
        return;
    }

    const htmlPromesas = linksValidos.map(async (link) => {
        let interiorHTML = '';
        
        if (link.includes("youtube.com") || link.includes("youtu.be")) {
            const ytId = getYoutubeId(link);
            if (ytId) {
                interiorHTML = `<img src="https://img.youtube.com/vi/${ytId}/maxresdefault.jpg" alt="YT Thumbnail" class="yt-thumbnail">`;
            }
        } 
        else if (link.includes("tiktok.com")) {
            const tiktokThumb = await getTikTokThumbnail(link);
            if (tiktokThumb) {
                interiorHTML = `<img src="${tiktokThumb}" alt="TikTok Thumbnail" class="yt-thumbnail">`;
            } else {
                interiorHTML = `<span style="font-size:16px;">▶ Ver TikTok</span>`;
            }
        }
        
        return `<a href="javascript:void(0)" onclick="openModal('${link}')" class="video-box-link">${interiorHTML}</a>`;
    });

    const elementosHtmlGenerados = await Promise.all(htmlPromesas);

    if (idActual !== renderId) {
        return; 
    }

    grid.innerHTML = elementosHtmlGenerados.join('');
}

function renderPrecios() {
    const datosContrato = infoPrecios[formatoActual][planActual];
    
    document.getElementById('pricing-price').innerHTML = datosContrato.precio;
    document.getElementById('pricing-rate').innerHTML = datosContrato.tarifa;
    

    const listaVentajas = document.getElementById('pricing-features');
    listaVentajas.innerHTML = '';
    
    datosContrato.ventajas.forEach(ventaja => {
        const li = document.createElement('li');
        li.textContent = ventaja;
        listaVentajas.appendChild(li);
    });

    if (planActual === 'standard') {
        listaVentajas.classList.add('check-list');
    } else {
        listaVentajas.classList.remove('check-list');
    }
}

function selectFormat(formato, element) {
    document.querySelectorAll('.format-tab').forEach(tab => tab.classList.remove('active'));
    element.classList.add('active');
    
    formatoActual = formato;
    renderVideos(); 
    renderPrecios(); // Actualiza la tarjeta si Horizontal/Vertical tienen precios distintos
}

function selectCategory(categoria, element) {
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    
    categoriaActual = categoria;
    renderVideos(); 
}

function switchPlan(plan) {
    const tabBasic = document.getElementById('tab-basic');
    const tabStandard = document.getElementById('tab-standard');
    const pricingCardBody = document.getElementById('pricing-card-body');

    planActual = plan;
    renderVideos();
    renderPrecios(); // Re-calcula la tarjeta al presionar Basic/Standard

    if(plan === 'basic') {
        tabBasic.classList.add('active'); tabBasic.classList.remove('inactive');
        tabStandard.classList.add('inactive'); tabStandard.classList.remove('active');
        tabBasic.innerHTML = "> Basic";
        tabStandard.innerHTML = "Standard";
        pricingCardBody.classList.remove('standard-active');
    } else if(plan === 'standard') {
        tabStandard.classList.add('active'); tabStandard.classList.remove('inactive');
        tabBasic.classList.add('inactive'); tabBasic.classList.remove('active');
        tabStandard.innerHTML = "> Standard";
        tabBasic.innerHTML = "Basic";
        pricingCardBody.classList.add('standard-active');
    }
}

// Iniciar página
window.onload = () => {
    renderVideos();
    renderPrecios();
    initAnimaciones();
    initYtJobs();
};

// =======================================================
// --- 6. LÓGICA DEL REPRODUCTOR MODAL ---
// =======================================================

function openModal(url) {
    const modal = document.getElementById('video-modal');
    const modalBox = document.getElementById('modal-box');
    const iframeContainer = document.getElementById('modal-iframe-container');

    let embedUrl = '';
    let isVertical = false;

    // 1. Procesar link de YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const ytId = getYoutubeId(url);
        // El parámetro autoplay=1 hace que el video inicie solo al abrir el modal
        embedUrl = `https://www.youtube.com/embed/${ytId}?autoplay=1`;
        
        // Si es un short o si estamos en la sección vertical, activamos el modo celular
        if (url.includes('/shorts/') || formatoActual === 'vertical') {
            isVertical = true;
        }
    } 
    // 2. Procesar link de TikTok
    else if (url.includes('tiktok.com')) {
        // Extraemos el ID del video de TikTok usando Expresiones Regulares
        const regex = /video\/(\d+)/;
        const match = url.match(regex);
        if (match && match[1]) {
            // URL especial de TikTok para incrustar reproductores
            embedUrl = `https://www.tiktok.com/embed/v2/${match[1]}`;
            isVertical = true; // TikTok siempre es vertical
        }
    }

    // 3. Ajustar el diseño de la caja (Horizontal o Vertical)
    if (isVertical) {
        modalBox.classList.add('vertical-mode');
    } else {
        modalBox.classList.remove('vertical-mode');
    }

    // 4. Inyectar el Iframe (Reproductor)
    iframeContainer.innerHTML = `<iframe src="${embedUrl}" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;

    // 5. Mostrar el Modal con animación
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('video-modal');
    const iframeContainer = document.getElementById('modal-iframe-container');

    // Ocultar modal
    modal.classList.remove('active');
    
    // CLAVE: Borramos el iframe para que el video deje de reproducirse y consumir memoria
    setTimeout(() => {
        iframeContainer.innerHTML = ''; 
    }, 300); // Esperamos 300ms para que termine la animación de opacidad antes de borrarlo
}


// =======================================================
// --- 7. ESTADÍSTICAS Y CLIENTES DE YT JOBS ---
// =======================================================
// Los datos los baja el GitHub Action (.github/workflows/update-ytjobs.yml)
// cada 6 horas y los guarda en data/ytjobs.json. YT Jobs no deja que el
// navegador le pida datos directo desde otra página, por eso pasamos por ese archivo.
const YTJOBS_DATA_URL = 'data/ytjobs.json';
const YTJOBS_REFRESH_MS = 5 * 60 * 1000; // re-chequea mientras la página está abierta

// Links que YT Jobs no trae (por nombre del canal)
const clientesLinks = {
    'AleWangBlox': 'https://www.youtube.com/@alewangblox',
    'Orza': 'https://www.youtube.com/@orzatech'
};

// Clientes que no están cargados en YT Jobs pero también laburé
const clientesExtra = [
    { name: 'FranAguirre', avatar: 'icons/cliente3.jpg', subscribers: 72000, link: 'https://www.youtube.com/@FranAguirree' }
];

// Copia de respaldo por si data/ytjobs.json no carga (ej: abrir el html sin servidor)
const ytjobsRespaldo = {
    updatedAt: '2026-10-22T03:16:01.999Z',
    stats: { views: 20063721, videos: 57, likes: 487400, comments: 13940, clients: 7, clientSubscribers: 4267400 },
    clients: [
        { name: 'Ale Wang', avatar: 'https://storage.ytjobs.co/channel_thumbnails/IJItynLT8HQtDu9ATSSWLaA2wMSz7bIj7Yx3pOCn.jpg', subscribers: 3450000, link: 'https://youtube.com/@alewang' },
        { name: 'Kino Frizza', avatar: 'https://storage.ytjobs.co/channel_thumbnails/5ULCPccZUH0EBy16dSnHQpmtSR3oB6waNbAqMhnW.jpg', subscribers: 553000, link: 'https://youtube.com/@kinofrizza' },
        { name: 'AleWangBlox', avatar: 'https://storage.ytjobs.co/channel_thumbnails/uitSkK3mf6CYVj6eFzHo28xCIlxlBVq7qjhsPkaH.jpg', subscribers: 207000, link: null },
        { name: 'Franchi Bal', avatar: 'https://storage.ytjobs.co/channel_thumbnails/qZNjGf74vwuoWUdDlsgpFwJZSCQuf0XyEiLNwBw2.jpg', subscribers: 33800, link: null },
        { name: 'Totisued', avatar: 'https://storage.ytjobs.co/channel_thumbnails/guZatrT9EQZdobOZtVHnEDLgtlYTyLnl3oDiFTNT.jpg', subscribers: 20000, link: null },
        { name: 'Orza', avatar: 'https://storage.ytjobs.co/channel_thumbnails/XsW1IjuDjUppZfd2ws7DZBomQBVXvpQvvspnaCSJ.jpg', subscribers: 2440, link: null },
        { name: 'Juanra Fumanal Emprendimiento', avatar: 'https://storage.ytjobs.co/channel_thumbnails/SpeRrIsSRUg0wfxxfyjtUpgTwNd7FLRfRScKHUCZ.jpg', subscribers: 1160, link: null }
    ]
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let ultimosClientes = '';

async function cargarYtJobs() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    try {
        const response = await fetch(`${YTJOBS_DATA_URL}?t=${Date.now()}`, { cache: 'no-store', signal: controller.signal });
        if (!response.ok) throw new Error(response.status);
        return await response.json();
    } catch (error) {
        console.warn('No se pudo cargar data/ytjobs.json, uso el respaldo:', error);
        return null;
    } finally {
        clearTimeout(timeout);
    }
}

// Junta los clientes de YT Jobs con los extras y recalcula los totales
function prepararDatos(data) {
    const nombres = new Set(data.clients.map(c => c.name.toLowerCase()));
    const extras = clientesExtra.filter(c => !nombres.has(c.name.toLowerCase()));

    const clientes = [...data.clients, ...extras]
        .map(c => ({
            ...c,
            link: c.link || clientesLinks[c.name] || `https://www.youtube.com/results?search_query=${encodeURIComponent(c.name)}`
        }))
        .sort((a, b) => b.subscribers - a.subscribers);

    return {
        updatedAt: data.updatedAt,
        clientes,
        stats: {
            ...data.stats,
            clients: clientes.length,
            clientSubscribers: clientes.reduce((sum, c) => sum + (c.subscribers || 0), 0)
        }
    };
}

// 20063721 -> "20.06M". La unidad sale del valor final, así no salta de K a M mientras cuenta
function formatStat(valor, final) {
    const unidades = [[1e9, 'B'], [1e6, 'M'], [1e3, 'K']];
    const unidad = unidades.find(([n]) => final >= n);
    if (!unidad) return Math.round(valor).toLocaleString('en-US');
    const [n, sufijo] = unidad;
    return Number((valor / n).toFixed(final / n >= 100 ? 1 : 2)) + sufijo; // Number() saca ceros de más: 72.00K -> 72K
}

function animarNumero(el, desde, hasta, duracion) {
    cancelAnimationFrame(el._raf);
    if (reduceMotion) {
        el.textContent = formatStat(hasta, hasta);
        return;
    }
    const inicio = performance.now();
    const paso = (ahora) => {
        const t = Math.min((ahora - inicio) / duracion, 1);
        const suavizado = 1 - Math.pow(1 - t, 4); // arranca rápido y frena al final
        el.textContent = formatStat(desde + (hasta - desde) * suavizado, hasta);
        if (t < 1) {
            el._raf = requestAnimationFrame(paso);
        } else {
            el.classList.remove('pop');
            void el.offsetWidth; // reinicia la animación CSS
            el.classList.add('pop');
        }
    };
    el._raf = requestAnimationFrame(paso);
}

// Cada contador sube desde 0 solo la primera vez que entra en pantalla (por carga de página)
const contadorObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        contadorObserver.unobserve(el);
        el.dataset.visto = '1';
        animarNumero(el, 0, Number(el.dataset.count), 2200);
    });
}, { threshold: 0.6 });

function setContador(el, valor) {
    const anterior = Number(el.dataset.count);
    el.dataset.count = valor;
    if (el.dataset.visto) {
        // Ya se vio: si YT Jobs trae un número nuevo, sube desde el viejo, no desde 0
        if (anterior !== valor) animarNumero(el, anterior, valor, 1200);
    } else if (!el.dataset.observado) {
        el.dataset.observado = '1';
        contadorObserver.observe(el);
    }
}

function renderClientes(clientes) {
    const firma = JSON.stringify(clientes);
    if (firma === ultimosClientes) return;
    ultimosClientes = firma;

    const grid = document.getElementById('clients-grid');
    grid.innerHTML = '';
    clientes.forEach((cliente, i) => {
        const card = document.createElement('a');
        card.href = cliente.link;
        card.target = '_blank';
        card.className = 'client-card reveal';
        card.style.setProperty('--i', i);
        card.innerHTML = `
            <div class="client-avatar-ring"><img class="client-avatar" alt="" loading="lazy"></div>
            <h3 class="client-name"></h3>
            <p class="client-subs"><span class="client-subs-number">0</span> Subs</p>`;
        const img = card.querySelector('img');
        img.src = cliente.avatar;
        img.alt = cliente.name;
        card.querySelector('.client-name').textContent = cliente.name;
        grid.appendChild(card);

        setContador(card.querySelector('.client-subs-number'), cliente.subscribers);
        revealObserver.observe(card);
    });
}

function renderFechaActualizacion(updatedAt) {
    const label = document.getElementById('stats-updated');
    const fecha = new Date(updatedAt);
    if (isNaN(fecha)) return;
    const horas = Math.round((Date.now() - fecha) / 36e5);
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const cuando = horas < 24 ? rtf.format(-horas, 'hour') : rtf.format(-Math.round(horas / 24), 'day');
    label.textContent = `Live from YT Jobs · updated ${cuando}`;
    label.title = fecha.toLocaleString();
}

function aplicarYtJobs(data) {
    const { stats, clientes, updatedAt } = prepararDatos(data);
    document.querySelectorAll('[data-stat]').forEach(el => {
        const valor = stats[el.dataset.stat];
        if (typeof valor === 'number') setContador(el, valor);
    });
    renderClientes(clientes);
    renderFechaActualizacion(updatedAt);
}

async function initYtJobs() {
    aplicarYtJobs((await cargarYtJobs()) || ytjobsRespaldo);

    setInterval(async () => {
        const data = await cargarYtJobs();
        if (data) aplicarYtJobs(data);
    }, YTJOBS_REFRESH_MS);
}


// =======================================================
// --- 8. ANIMACIONES DE LA PÁGINA ---
// =======================================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

function initAnimaciones() {
    // Aparición al hacer scroll (las tarjetas de un mismo grupo entran escalonadas)
    document.querySelectorAll('.reveal').forEach(el => {
        if (!el.style.getPropertyValue('--i')) {
            const hermanos = [...el.parentElement.children].filter(h => h.classList.contains('reveal'));
            el.style.setProperty('--i', hermanos.indexOf(el));
        }
        revealObserver.observe(el);
    });

    // Barra de progreso + sombra del navbar
    const barra = document.getElementById('scroll-progress');
    const topbar = document.getElementById('topbar');
    const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        barra.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
        topbar.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Los íconos del hero siguen un poquito al mouse (parallax)
    if (reduceMotion || !window.matchMedia('(pointer: fine)').matches) return;
    const hero = document.querySelector('.figma-canvas');
    const assets = [...hero.querySelectorAll('.figma-asset')];
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        assets.forEach((asset, i) => {
            const fuerza = 10 + (i % 4) * 8;
            asset.style.translate = `${-x * fuerza}px ${-y * fuerza}px`;
        });
    });
    hero.addEventListener('mouseleave', () => assets.forEach(a => a.style.translate = '0 0'));
}