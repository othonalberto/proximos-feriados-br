const fetch = require('node-fetch')

async function obtemFeriados (dataHoje, n = 1) {
  const dataSeparada = dataHoje.toString().split('/')
  const mes = dataSeparada[1]
  const dia = dataSeparada[2]
  const ano = dataSeparada[0]

  const resposta = await fetch('https://date.nager.at/api/v2/publicholidays/' + ano + '/BR')
  const dados = await resposta.json()

  const proximoAno = (n > dados.length) ? (await fetch('https://date.nager.at/api/v2/publicholidays/' + (ano + 1) + '/BR')) : null
  const dadosProx = (proximoAno) ? await proximoAno.json() : null


  const proximosFeriadosAno = dados.filter(x => {
    return (parseInt(x.date.split('-')[1]) > mes ||
           (parseInt(x.date.split('-')[1]) === mes && parseInt(x.date.split('-')[2]) > dia)
    )
  })

  const todos = (dadosProx) ? proximosFeriadosAno.concat(dadosProx) : proximosFeriadosAno

  const resultado = todos.slice(0, n).map(x => {
    return {
      'nome': x.localName,
      'data': formataDataBR(x.date)
    }
  })

  return resultado
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
