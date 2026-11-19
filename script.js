// LOCALIZANDO OS ELEMENTOS DO HTML
const cep = document.querySelector("#cep");
const endereco = document.querySelector("#endereco");
const bairro = document.querySelector("#bairro");
const cidade = document.querySelector("#cidade");
const estado = document.querySelector("#estado");

const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

// FUNÇÃO PARA CONSULTAR O CEP
async function consultarCEP() {

    // Remove tudo que não for número
    const numeroCEP = cep.value.replace(/\D/g, "");

    // Verifica se o CEP possui 8 números
    if (numeroCEP.length !== 8) {
        resultado.textContent = "Digite um CEP válido.";
        resultado.style.color = "red";
        return;
    }

    try {

        // Consulta a API ViaCEP
        const resposta = await fetch(
            `https://viacep.com.br/ws/${numeroCEP}/json/`
        );

        // Transforma a resposta em JSON
        const dados = await resposta.json();

        // Verifica se o CEP existe
        if (dados.erro) {

            resultado.textContent = "CEP não encontrado.";
            resultado.style.color = "red";

            // Limpa os campos de endereço
            endereco.value = "";
            bairro.value = "";
            cidade.value = "";
            estado.value = "";

            return;
        }

        // Preenche automaticamente os campos
        endereco.value = dados.logradouro || "";
        bairro.value = dados.bairro || "";
        cidade.value = dados.localidade || "";
        estado.value = dados.uf || "";

        // Mensagem de sucesso
        resultado.textContent =
            "Endereço encontrado com sucesso!";

        resultado.style.color = "green";

    } catch (erro) {

        // Caso aconteça algum erro na consulta
        resultado.textContent = "Erro ao consultar o CEP.";
        resultado.style.color = "red";

    }

}

// CONSULTA O CEP QUANDO O USUÁRIO SAI DO CAMPO
cep.addEventListener("blur", consultarCEP);

// FORMATAÇÃO SIMPLES DO CEP
cep.addEventListener("input", function() {

    // Mantém apenas os números
    let valor = cep.value.replace(/\D/g, "");

    // Limita a quantidade de números
    valor = valor.substring(0, 8);

    // Adiciona o hífen depois dos cinco primeiros números
    if (valor.length > 5) {
        valor = valor.replace(/^(\d{5})(\d)/, "$1-$2");
    }

    // Atualiza o campo
    cep.value = valor;

});

// EVENTO DE ENVIO DO FORMULÁRIO
formulario.addEventListener("submit", function(event) {

    // Impede que a página seja recarregada
    event.preventDefault();

    // Verifica se todos os campos obrigatórios foram preenchidos
    if (!formulario.checkValidity()) {
        formulario.reportValidity();
        return;
    }

    // Exibe mensagem de confirmação
    resultado.textContent =
        "Mensagem registrada! Obrigado por entrar em contato com a GasSafe.";

    resultado.style.color = "green";

    // Limpa os campos depois do envio
    formulario.reset();

});