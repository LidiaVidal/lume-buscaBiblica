let cardContainer = document.querySelector(".card-container");
let estadoZero = document.querySelector(".estado-zero");
let campoBusca = document.querySelector("header input");
let dados = [];

function toggleMode() {
    const html = document.documentElement;
    const img = document.querySelector('header img');
    html.classList.toggle('dark');

    if (html.classList.contains('dark')) {
        img.setAttribute("src", "./assets/logoLume-dark.svg");
    } else {
        img.setAttribute("src", './assets/logoLume.svg');
    }
}

function normalizarTexto(texto) {
    return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

async function iniciarBusca() {
    const entradaUsuario = normalizarTexto(campoBusca.value);

    // Carrega dados do JSON apenas se o array estiver vazio
    if (dados.length === 0) {
        try {
            let resposta = await fetch("data.json");
            dados = await resposta.json();
        } catch (error) {
            console.error("Falha ao buscar dados:", error);
            return;
        }
    }

    const palavrasProibidas = ["de", "da", "do", "em", "na", "no", "com", "por", "o", "a", "e", "que", "estou", "me", "pra"];
    const palavrasUsuario = entradaUsuario.split(" ").filter(palavra => !palavrasProibidas.includes(palavra) && palavra.length > 2);

    if (palavrasUsuario.length === 0) return;

    const dadosFiltrados = dados.filter(dado => {
        const textoBanco = normalizarTexto(dado.nome);
        const tagsBanco = textoBanco.split(',').map(tag => tag.trim());

        return palavrasUsuario.some(palavraUser => {
            return tagsBanco.some(tag => tag.includes(palavraUser));
        });
    });

    estadoZero.style.display = "none";
    renderizarCards(dadosFiltrados);
}

function renderizarCards(dados) {
    cardContainer.innerHTML = "";

    if (dados.length === 0) {
        cardContainer.innerHTML = `
            <div class="mensagem-vazio">
                <p>Ainda não aprendi sobre esse sentimento...</p>
                <p>Tente simplificar, digitando apenas uma palavra como "Medo" ou "Cansaço".</p>
            </div>
        `;
        return;
    }

    for (let dado of dados) {
        let tituloCard = dado.nome.split(',')[0];
        let article = document.createElement("article");
        
        article.classList.add("card");
        article.innerHTML = `
            <h2>${tituloCard}</h2>
            <p class="versiculo">${dado.versiculo}</p>
            <p>${dado.conselho}</p>
            <p>${dado.dica}</p>
        `;
        cardContainer.appendChild(article);
    }
}

campoBusca.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        iniciarBusca();
    }
});