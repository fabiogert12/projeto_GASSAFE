/* =========================================
   LOCALIZANDO OS ELEMENTOS DO HTML
========================================= */

const cep = document.querySelector("#cep");
const endereco = document.querySelector("#endereco");
const bairro = document.querySelector("#bairro");
const cidade = document.querySelector("#cidade");
const estado = document.querySelector("#estado");

const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

// Ajuda a identificar rápido se algum ID no HTML está diferente
if (!cep || !endereco || !bairro || !cidade || !estado || !formulario || !resultado) {
    console.error("Um ou mais elementos não foram encontrados no HTML. Confira os IDs:", {
        cep, endereco, bairro, cidade, estado, formulario, resultado
    });
}


/* =========================================
   FUNÇÃO PARA LIMPAR OS CAMPOS DE ENDEREÇO
========================================= */

function limparEndereco() {
    if (endereco) endereco.value = "";
    if (bairro) bairro.value = "";
    if (cidade) cidade.value = "";
    if (estado) estado.value = "";
}


/* =========================================
   FUNÇÃO PARA CONSULTAR O CEP
========================================= */

async function consultarCEP() {
    if (!cep || !resultado) return;

    const numeroCEP = cep.value.replace(/\D/g, "");

    if (numeroCEP.length === 0) {
        resultado.textContent = "";
        limparEndereco();
        return;
    }

    if (numeroCEP.length !== 8) {
        resultado.textContent = "Digite um CEP válido com 8 números.";
        resultado.style.color = "red";
        limparEndereco();
        return;
    }

    resultado.textContent = "Buscando CEP...";
    resultado.style.color = "gray";

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${numeroCEP}/json/`);

        if (!resposta.ok) {
            throw new Error(`HTTP ${resposta.status}`);
        }

        const dados = await resposta.json();

        // ViaCEP retorna { "erro": "true" } quando o CEP tem formato válido mas não existe
        if (dados.erro) {
            resultado.textContent = "CEP não encontrado.";
            resultado.style.color = "red";
            limparEndereco();
            return;
        }

        endereco.value = dados.logradouro || "";
        bairro.value = dados.bairro || "";
        cidade.value = dados.localidade || "";
        estado.value = dados.uf || "";

        resultado.textContent = "Endereço encontrado com sucesso!";
        resultado.style.color = "green";

    } catch (erro) {
        console.error("Erro ao consultar ViaCEP:", erro);
        resultado.textContent = "Erro ao consultar o CEP. Tente novamente.";
        resultado.style.color = "red";
        limparEndereco();
    }
}


/* =========================================
   EVENTOS DO CAMPO CEP
========================================= */

if (cep) {
    cep.addEventListener("blur", consultarCEP);

    cep.addEventListener("input", function () {
        let valor = cep.value.replace(/\D/g, "").substring(0, 8);

        if (valor.length > 5) {
            valor = valor.replace(/^(\d{5})(\d)/, "$1-$2");
        }

        cep.value = valor;
        limparEndereco();
        if (resultado) resultado.textContent = "";

        // Opcional: consulta automaticamente assim que completar 8 dígitos
        if (valor.replace(/\D/g, "").length === 8) {
            consultarCEP();
        }
    });
}


/* =========================================
   EVENTO DE ENVIO DO FORMULÁRIO
========================================= */

if (formulario) {
    formulario.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!formulario.checkValidity()) {
            formulario.reportValidity();
            return;
        }

        if (resultado) {
            resultado.textContent = "Mensagem registrada! Obrigado por entrar em contato com a GasSafe.";
            resultado.style.color = "green";
        }

        formulario.reset();
    });
}