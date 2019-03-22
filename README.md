# Próximos Feriados BR

Biblioteca desenvolvida para retornar os próximos feriados **nacionais** no formato {nome: 'NomeLegal', data: 'DD/MM/AAAA'}, utilizando a API [Nager.Date](https://date.nager.at/).

# Como utilizar


Para utilizar, basta informar a quantidade de próximos feriados que deseja receber. A biblioteca pode retornar, no máximo, feriados até o próximo ano. Ou seja, apenas os feriados entre a data atual e o final do próximo ano serão retornados, caso a entrada seja maior que esse intervalo.

Exemplos:

```

// consulta executada em 22/03/2019

const { proximosFeriados } = require('proximos-feriados-br')

proximosFeriados(2)
  .then(console.log)

// retorna:
// [ { nome: 'Sexta feira Santa', data: '19/04/2019' },
//   { nome: 'Dia de Tiradentes', data: '21/04/2019' } ]

```

```
// consulta executada em 22/03/2019

const { proximosFeriados } = require('proximos-feriados-br')

proximosFeriados()
  .then(console.log)

// retorna:
// [ { nome: 'Sexta feira Santa', data: '19/04/2019' }]

```

# Instalação

```$ npm install --save proximos-feriados-br ```
