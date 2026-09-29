// ==========================================
// CADASTRO DO CLIENTE
// ==========================================

const cadastroForm = document.getElementById("cadastroForm");

const mensagemCadastro =
    document.getElementById("mensagemCadastro");


cadastroForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const nome =
        document.getElementById("nome").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const senha =
        document.getElementById("senha").value;

    const lgpd =
        document.getElementById("lgpd").checked;


    // Validação

    if (!nome || !email || !senha) {

        mostrarMensagem(
            "Preencha todos os campos.",
            "erro"
        );

        return;
    }


    if (senha.length < 6) {

        mostrarMensagem(
            "A senha deve possuir pelo menos 6 caracteres.",
            "erro"
        );

        return;
    }


    if (!lgpd) {

        mostrarMensagem(
            "É necessário aceitar os termos de privacidade.",
            "erro"
        );

        return;
    }


    /*
        IMPORTANTE:

        Em um sistema real, a senha NÃO deve ser
        armazenada diretamente no localStorage.

        Aqui estamos armazenando apenas os dados
        necessários para uma demonstração front-end.
    */

    const cliente = {
        nome: nome,
        email: email,
        dataCadastro: new Date().toISOString(),
        consentimentoLGPD: true
    };


    localStorage.setItem(
        "cliente",
        JSON.stringify(cliente)
    );


    mostrarMensagem(
        `Cadastro realizado com sucesso, ${nome}!`,
        "sucesso"
    );


    cadastroForm.reset();

});


// ==========================================
// MENSAGEM DO CADASTRO
// ==========================================

function mostrarMensagem(texto, tipo) {

    mensagemCadastro.textContent = texto;

    mensagemCadastro.className = tipo;
}


// ==========================================
// DESPENSA
// ==========================================

const ingredienteForm =
    document.getElementById("ingredienteForm");

const listaIngredientes =
    document.getElementById("listaIngredientes");


let ingredientes =
    JSON.parse(
        localStorage.getItem("ingredientes")
    ) || [];


// ==========================================
// ADICIONAR INGREDIENTE
// ==========================================

ingredienteForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const nome =
            document
                .getElementById("ingrediente")
                .value
                .trim();

        const quantidade =
            document
                .getElementById("quantidade")
                .value;

        const unidade =
            document
                .getElementById("unidade")
                .value;

        const categoria =
            document
                .getElementById("categoria")
                .value;

        const local =
            document
                .getElementById("local")
                .value;

        const validade =
            document
                .getElementById("validade")
                .value;


        // Validação

        if (!nome || !quantidade) {

            alert(
                "Preencha o nome e a quantidade do ingrediente."
            );

            return;
        }


        // Criando objeto

        const novoIngrediente = {

            id: Date.now(),

            nome: nome,

            quantidade: quantidade,

            unidade: unidade,

            categoria: categoria,

            local: local,

            validade: validade

        };


        // Adiciona à lista

        ingredientes.push(novoIngrediente);


        // Salva no navegador

        salvarIngredientes();


        // Atualiza a tela

        renderizarIngredientes();


        // Limpa formulário

        ingredienteForm.reset();

    }
);


// ==========================================
// SALVAR INGREDIENTES
// ==========================================

function salvarIngredientes() {

    localStorage.setItem(
        "ingredientes",
        JSON.stringify(ingredientes)
    );
}


// ==========================================
// EXIBIR INGREDIENTES
// ==========================================

function renderizarIngredientes() {

    listaIngredientes.innerHTML = "";


    // Caso não existam ingredientes

    if (ingredientes.length === 0) {

        listaIngredientes.innerHTML = `
            <p class="vazio">
                Nenhum ingrediente cadastrado.
            </p>
        `;

        return;
    }


    // Percorre os ingredientes

    ingredientes.forEach(function (ingrediente) {

        const div =
            document.createElement("div");

        div.classList.add("ingrediente");


        let validadeFormatada =
            "Não informada";


        if (ingrediente.validade) {

            const data =
                new Date(
                    ingrediente.validade + "T00:00:00"
                );

            validadeFormatada =
                data.toLocaleDateString("pt-BR");
        }


        div.innerHTML = `

            <div class="ingrediente-topo">

                <h3>
                    ${escaparHTML(ingrediente.nome)}
                </h3>

                <button
                    class="btn-excluir"
                    onclick="excluirIngrediente(${ingrediente.id})"
                >
                    Excluir
                </button>

            </div>


            <div class="ingrediente-info">

                <p>
                    <strong>Quantidade:</strong>
                    ${escaparHTML(ingrediente.quantidade)}
                    ${escaparHTML(ingrediente.unidade)}
                </p>

                <p>
                    <strong>Categoria:</strong>
                    ${escaparHTML(ingrediente.categoria)}
                </p>

                <p>
                    <strong>Local:</strong>
                    ${escaparHTML(ingrediente.local)}
                </p>

                <p>
                    <strong>Validade:</strong>
                    ${validadeFormatada}
                </p>

            </div>
        `;


        listaIngredientes.appendChild(div);

    });

}


// ==========================================
// EXCLUIR INGREDIENTE
// ==========================================

function excluirIngrediente(id) {

    const confirmar =
        confirm(
            "Deseja realmente excluir este ingrediente?"
        );


    if (!confirmar) {
        return;
    }


    ingredientes =
        ingredientes.filter(function (ingrediente) {

            return ingrediente.id !== id;

        });


    salvarIngredientes();

    renderizarIngredientes();

}


// ==========================================
// LIMPAR TODA A LISTA
// ==========================================

const limparLista =
    document.getElementById("limparLista");


limparLista.addEventListener(
    "click",
    function () {

        if (ingredientes.length === 0) {

            alert(
                "A lista já está vazia."
            );

            return;
        }


        const confirmar =
            confirm(
                "Deseja excluir todos os ingredientes?"
            );


        if (!confirmar) {
            return;
        }


        ingredientes = [];


        salvarIngredientes();

        renderizarIngredientes();

    }
);


// ==========================================
// PROTEÇÃO CONTRA HTML INJETADO
// ==========================================

function escaparHTML(texto) {

    const elemento =
        document.createElement("div");

    elemento.textContent = texto;

    return elemento.innerHTML;
}


// ==========================================
// CARREGAR DADOS AO ABRIR A PÁGINA
// ==========================================

renderizarIngredientes();
