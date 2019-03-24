const fetch = require('node-fetch')

async function consomeAPI (ano, n = 1) {
  // Esta função retorna um vetor de duas posições
  // [0]: feriados do ano atual
  // [1]: feriados do ano seguinte, caso N seja maior que a quantidade de feriados deste ano
  // Em caso de erro ao consumir a API, retorna Error('Erro ao consumir API de feriados.')

  const anoAtual = parseInt(ano)

  try {
    const resposta = await fetch('https://date.nager.at/api/v2/publiccholidays/' + anoAtual + '/BR')
    const dados = await resposta.json()

    const proximoAno = (n > dados.length) ? (await fetch('https://date.nager.at/api/v2/publicholidays/' + (anoAtual + 1) + '/BR')) : null
    const dadosProx = (proximoAno) ? await proximoAno.json() : null

    return [dados, dadosProx]
  } catch (e) {
    throw new Error('Erro ao consumir API de feriados.')
  }
}

async function obtemFeriados (dataHoje, n = 1) {
  const dataSeparada = dataHoje.toString().split('/')
  const mes = dataSeparada[1]
  const dia = dataSeparada[2]
  const ano = dataSeparada[0]

  try {
    const retornoAPI = await consomeAPI(ano, n)

    const proximosFeriadosAno = retornoAPI[0].filter(x => {
      return (parseInt(x.date.split('-')[1]) > mes ||
             (parseInt(x.date.split('-')[1]) === mes && parseInt(x.date.split('-')[2]) > dia)
      )
    })

    const todos = (retornoAPI[1]) ? proximosFeriadosAno.concat(retornoAPI[0]) : proximosFeriadosAno

    const resultado = todos.slice(0, n).map(x => {
      return {
        'nome': x.localName,
        'data': formataDataBR(x.date)
      }
    })

    return resultado
  } catch (e) {
    console.error(e)
  }
}

function formataDataBR (data) {
  const separados = data.toString().split('-')

  return (separados[2] + '/' + separados[1] + '/' + separados[0])
}

module.exports.proximosFeriados = function (n = 1) {
  const num = (parseInt(n) > 0) ? (parseInt(n)) : 1

  const d = new Date()
  const dataCompleta = d.getFullYear() + '/' + (d.getUTCMonth() + 1) + '/' + d.getDate()

  return obtemFeriados(dataCompleta, num)
}
