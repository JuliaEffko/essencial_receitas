
document.addEventListener("DOMContentLoaded", () => {
    // ========================================
    // 1. ELEMENTOS DA PÁGINA
    // ========================================

    const menu = document.querySelector(".menu");
    const cabecalho = document.querySelector(".cabecalho");
    const hero = document.querySelector(".hero");
    const cardsReceitas = document.querySelectorAll(".card-receita");
    const cardsAtalhos = document.querySelectorAll(".card-atalho");

    // ========================================
    // 2. MENU RESPONSIVO
    // ========================================

    if (menu && cabecalho) {
        const botaoMenu = document.createElement("button");

        botaoMenu.type = "button";
        botaoMenu.className = "botao-menu";
        botaoMenu.innerHTML = "☰";
        botaoMenu.setAttribute("aria-label", "Abrir menu");
        botaoMenu.setAttribute("aria-expanded", "false");

        cabecalho.insertBefore(botaoMenu, menu);

        botaoMenu.addEventListener("click", () => {
            const aberto = menu.classList.toggle("menu-aberto");

            botaoMenu.innerHTML = aberto ? "✕" : "☰";
            botaoMenu.setAttribute("aria-expanded", String(aberto));
            botaoMenu.setAttribute(
                "aria-label",
                aberto ? "Fechar menu" : "Abrir menu"
            );
        });

        menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                menu.classList.remove("menu-aberto");
                botaoMenu.innerHTML = "☰";
                botaoMenu.setAttribute("aria-expanded", "false");
            });
        });
    }

    // ========================================
    // 3. IDENTIFICAR A PÁGINA ATUAL NO MENU
    // ========================================

    const paginaAtual = window.location.pathname.split("/").pop()
        || "index.html";

    document.querySelectorAll(".menu a").forEach((link) => {
        const destino = link.getAttribute("href");

        if (destino === paginaAtual) {
            link.classList.add("ativo");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("ativo");
            link.removeAttribute("aria-current");
        }
    });

    // ========================================
    // 4. MENSAGENS DE INTERAÇÃO
    // ========================================

    function mostrarMensagem(mensagem) {
        let aviso = document.querySelector(".aviso-site");

        if (!aviso) {
            aviso = document.createElement("div");
            aviso.className = "aviso-site";
            aviso.setAttribute("role", "status");
            aviso.setAttribute("aria-live", "polite");
            document.body.appendChild(aviso);
        }

        aviso.textContent = mensagem;
        aviso.classList.add("aviso-visivel");

        clearTimeout(mostrarMensagem.timer);

        mostrarMensagem.timer = setTimeout(() => {
            aviso.classList.remove("aviso-visivel");
        }, 3000);
    }

    // ========================================
    // 5. INTERAÇÃO COM AS RECEITAS
    // ========================================

    cardsReceitas.forEach((card) => {
        const titulo = card.querySelector("h3");
        const descricao = card.querySelector(".receita-info p");
        const categoria = card.querySelector(".categoria");

        if (!titulo) return;

        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");
        card.setAttribute(
            "aria-label",
            `Ver detalhes de ${titulo.textContent.trim()}`
        );

        function abrirReceita() {
            const nome = titulo.textContent.trim();
            const detalhes = descricao
                ? descricao.textContent.trim()
                : "";

            const tipo = categoria
                ? categoria.textContent.trim()
                : "";

            const destino = new URL("receitas.html", window.location.href);
            destino.searchParams.set("receita", nome);

            // Se a página de receitas existir, abre os detalhes nela.
            window.location.href = destino.href;
        }

        card.addEventListener("click", abrirReceita);

        card.addEventListener("keydown", (evento) => {
            if (
                evento.target === card &&
                (evento.key === "Enter" || evento.key === " ")
            ) {
                evento.preventDefault();
                abrirReceita();
            }
        });
    });

    // ========================================
    // 6. INTERAÇÃO COM OS ATALHOS
    // ========================================

    cardsAtalhos.forEach((card) => {
        card.addEventListener("mouseenter", () => {
            card.classList.add("card-destacado");
        });

        card.addEventListener("mouseleave", () => {
            card.classList.remove("card-destacado");
        });
    });

    // ========================================
    // 7. BOTÕES PRINCIPAIS
    // ========================================

    document.querySelectorAll(
        ".botao-principal, .botao-secundario, .botao-chamada"
    ).forEach((botao) => {
        botao.addEventListener("click", () => {
            botao.classList.add("botao-clicado");

            setTimeout(() => {
                botao.classList.remove("botao-clicado");
            }, 180);
        });
    });

    // ========================================
    // 8. ANO AUTOMÁTICO NO RODAPÉ
    // ========================================

    const textoRodape = document.querySelector(".rodape p");

    if (textoRodape) {
        textoRodape.textContent =
            `Menos desperdício, mais sabor. © ${new Date().getFullYear()} Essencial Receitas.`;
    }

    // ========================================
    // 9. IMAGENS COM TRATAMENTO DE ERRO
    // ========================================

    document.querySelectorAll("img").forEach((imagem) => {
        imagem.addEventListener("error", () => {
            imagem.alt = imagem.alt || "Imagem indisponível";
            imagem.classList.add("imagem-indisponivel");
        });
    });

    // ========================================
    // 10. ANIMAÇÃO DE ENTRADA DAS SEÇÕES
    // ========================================

    const secoes = document.querySelectorAll(
        ".hero, .atalhos, .receitas, .chamada"
    );

    if ("IntersectionObserver" in window) {
        const observador = new IntersectionObserver(
            (entradas, observer) => {
                entradas.forEach((entrada) => {
                    if (entrada.isIntersecting) {
                        entrada.target.classList.add("secao-visivel");
                        observer.unobserve(entrada.target);
                    }
                });
            },
            {
                threshold: 0.1
            }
        );

        secoes.forEach((secao) => {
            secao.classList.add("secao-animada");
            observador.observe(secao);
        });
    } else {
        secoes.forEach((secao) => {
            secao.classList.add("secao-visivel");
        });
    }
});
