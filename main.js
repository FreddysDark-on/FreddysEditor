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

// =======================================================
// --- 2. BASE DE DATOS DE PRECIOS Y VENTAJAS ---
// =======================================================
const infoPrecios = {
    horizontal: {
        basic: {
            precio: "20$",
            tarifa: "2 x min",
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
            precio: "50$",
            tarifa: "5 x min",
            ventajas: [
                "Everything above", 
                "Better Sound Effects", 
                "2D + 3D Basic Motion Graphics", 
                "Graphics", 
                "1-4 days delivery", 
                "Unlimited Revisions"
            ]
        }
    },
    vertical: {
        basic: {
            precio: "4$",
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
            precio: "10$",
            tarifa: "",
            ventajas: [
                "Everything above", 
                "Dynamic Music", 
                "2D + 3D Motion Graphics", 
                "Graphics", 
                "1-4 days delivery", 
                "Unlimited Revisions"
            ]
        }
    }
};

// ESTADO GLOBAL
let planActual = 'basic'; 
let formatoActual = 'horizontal';
let categoriaActual = 'gameplay';
let renderId = 0;

// =======================================================
// --- 3. FUNCIONES DE EXTRACCIÓN (YOUTUBE/TIKTOK) ---
// =======================================================
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

// =======================================================
// --- 4. RENDERIZADO VISUAL ---
// =======================================================
// 🛠️ RENDERIZADO OPTIMIZADO (Con parche anti-condición de carrera)
async function renderVideos() {
    renderId++; // Incrementamos el ID global en cada clic
    const idActual = renderId; // Capturamos el ID de este clic específico de forma local
    
    const grid = document.getElementById('video-grid');
    grid.innerHTML = '<p style="color:#6B7280; grid-column: 1 / -1;">Loading...</p>'; 
    
    const linksCrudos = misVideos[planActual][formatoActual][categoriaActual] || [];
    const linksValidos = linksCrudos.filter(link => link !== "");

    if (linksValidos.length === 0) {
        // 🔥 VERIFICACIÓN: Si el usuario ya clickeó otra cosa mientras filtrábamos, abortamos
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
        
        return `<a href="${link}" target="_blank" class="video-box-link">${interiorHTML}</a>`;
    });

    // Esperamos las respuestas asíncronas de las APIs externas
    const elementosHtmlGenerados = await Promise.all(htmlPromesas);

    // 🔥 LA MAGIA: Si idActual no coincide con renderId, significa que el usuario
    // hizo un clic nuevo mientras esperábamos. Abortamos esta ejecución vieja para que no rompa el diseño.
    if (idActual !== renderId) {
        return; 
    }

    grid.innerHTML = elementosHtmlGenerados.join('');
}

// 🔥 NUEVA FUNCIÓN: Actualiza el precio y las ventajas dinámicamente
function renderPrecios() {
    const datosContrato = infoPrecios[formatoActual][planActual];
    
    // Inyecta precio y tarifa
    document.getElementById('pricing-price').innerHTML = datosContrato.precio;
    document.getElementById('pricing-rate').innerHTML = datosContrato.tarifa;
    
    // Limpia las ventajas anteriores e inyecta las nuevas
    const listaVentajas = document.getElementById('pricing-features');
    listaVentajas.innerHTML = '';
    
    datosContrato.ventajas.forEach(ventaja => {
        const li = document.createElement('li');
        li.textContent = ventaja;
        listaVentajas.appendChild(li);
    });

    // Cambia el estilo de los "tics" (puntos blancos vs tics celestes)
    if (planActual === 'standard') {
        listaVentajas.classList.add('check-list');
    } else {
        listaVentajas.classList.remove('check-list');
    }
}

// =======================================================
// --- 5. EVENTOS DE CLICK ---
// =======================================================
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
};