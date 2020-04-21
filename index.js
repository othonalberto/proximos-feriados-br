import fetch from 'node-fetch';

async function consomeAPI (ano) {
    try {
        const requestUrl = constroiRequest(parseInt(ano));

        const resposta = await fetch(requestUrl);

        return resposta.json();
    } catch (e) {
        throw new Error(`Erro ao consumir API de feriados: ${e}`);
    }
}

async function obtemFeriados (dataHoje, n = 1) {
    const dataSeparada = dataHoje.toString().split('/');
    const ano = parseInt(dataSeparada[0]);

    try {
        const retornoAPI = await consomeAPI(ano, n);

        const feriadosAnoAtual = retornoAPI.filter((feriado) => feriadoValido(feriado, dataSeparada));

        const feriadosProximoAno = (feriadosAnoAtual.length < n) ? await consomeAPI(ano + 1) : null;

        const feriados = feriadosAnoAtual.concat(feriadosProximoAno);

        const resultado = feriados.slice(0, n).map((feriado) => constroiObjetoFeriado(feriado));

        return resultado;
    } catch (e) {
        console.error(e);
        return e;
    }
}

function formataDataBR(data) {
    const separados = data.toString().split('-');

    return (`${separados[2]}/${separados[1]}/${separados[0]}`);
}

function constroiObjetoFeriado(data) {
    const obj = {
        nome: data.localName,
        data: formataDataBR(data.date),
    };

    return obj;
}

function feriadoValido(feriado, dataAtual) {
    const dataSeparada = feriado.date.split('-');
    const mes = parseInt(dataSeparada[1]);
    const dia = parseInt(dataSeparada[2]);

    const mesAtual = parseInt(dataAtual[1]);
    const diaAtual = parseInt(dataAtual[2]);

    if (mes === mesAtual) {
        return (dia > diaAtual);
    }

    return (mes > mesAtual);
}

function constroiRequest(ano) {
    return `https://date.nager.at/api/v2/PublicHolidays/${ano}/BR`;
}

export function proximosFeriados (n = 1) {
    const num = (parseInt(n) > 0) ? (parseInt(n)) : 1;

    const d = new Date();
    const dataCompleta = `${d.getFullYear()}/${d.getUTCMonth() + 1}/${d.getDate()}`;

    return obtemFeriados(dataCompleta, num);
}
