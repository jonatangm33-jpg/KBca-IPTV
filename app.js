// Lista de exemplo baseada em TMDB IDs compatíveis com o frameXTV
const mediaItems = [
    { id: 550, title: "Clube da Luta", type: "movie", poster: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg" },
    { id: 1399, title: "Game of Thrones", type: "series", season: 1, episode: 1, poster: "https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg" },
    { id: 299534, title: "Vingadores: Ultimato", type: "movie", poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg" }
];

const grid = document.getElementById('media-grid');
const modal = document.getElementById('player-modal');
const iframe = document.getElementById('video-iframe');
const modalTitle = document.getElementById('modal-title');

// Renderizar catálogo na tela
function renderGrid(filter = 'all') {
    grid.innerHTML = '';
    const filtered = filter === 'all' ? mediaItems : mediaItems.filter(i => i.type === filter);
    
    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = "bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 cursor-pointer hover:scale-105 transition duration-200 flex flex-col";
        card.onclick = () => openPlayer(item.id, item.season, item.episode, item.title);
        
        card.innerHTML = `
            <div class="aspect-[2/3] bg-zinc-800 relative">
                <img src="${item.poster}" alt="${item.title}" class="w-full h-full object-cover">
            </div>
            <div class="p-3">
                <h4 class="font-medium text-sm truncate">${item.title}</h4>
                <span class="text-xs text-zinc-500 uppercase">${item.type}</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterCategory(type) {
    renderGrid(type);
}

// Abrir Modal e montar a URL do Iframe baseada na documentação
function openPlayer(tmdbId, season, episode, title) {
    let embedUrl = season && episode
        ? `https://framextv.xyz/embed/${tmdbId}/${season}/${episode}?autoplay=1&muted=0`
        : `https://framextv.xyz/embed/${tmdbId}?autoplay=1&muted=0`;

    modalTitle.innerText = title;
    iframe.src = embedUrl;
    modal.classList.remove('hidden');
}

// Fechar Modal e limpar o src do iframe para parar o vídeo
function closePlayer() {
    iframe.src = "";
    modal.classList.add('hidden');
}

// Inicializar app
renderGrid();

// Exemplo de uso do postMessage (conforme sua documentação) caso queira interagir com o player depois:
// iframe.contentWindow.postMessage({ action: 'play' }, '*');
