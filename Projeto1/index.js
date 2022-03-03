const lojaDeJogos = {
    'The Witcher': {
      nome: 'The Witcher 3: Wild Hunt',
      ano: 2015,
      preco: 60.0,
      genero: 'RPG',
    },
    'FIFA 22': {
      nome: 'FIFA 22',
      ano: 2021,
      preco: 200.0,
      genero: 'Esporte',
    },
    'The Last of Us Part II': {
      nome: 'The Last of Us Part II',
      ano: 2020,
      preco: 120.0,
      genero: 'Ação-Aventura'
    },
    'The Elder Scrolls V: Skyrim': {
      nome: 'The Elder Scrolls V: Skyrim',
      ano: 2011,
      preco: 60.0,
      genero: 'RPG'
    },
    'Just Dance 2022': {
      nome: 'Just Dance 2022',
      ano: 2021,
      preco: 190.0,
      genero: 'Música'
    },
}

const express = require('express');
const app = express();

app.use(express.json());

// Retorna todos os jogos em nosso "Banco de Dados"
app.get('/admin', (req, res) => res.json(lojaDeJogos));

// Busca os detalhes de um jogo específico a partir de seu nome
app.get('/admin/:nomeJogo', (req, res) => {
    const { nomeJogo } = req.params;
    const jogo = lojaDeJogos[nomeJogo];

    if (!jogo) return res.status(400).send('Este jogo não se encontra no banco');

    res.json(jogo);
})

// Adiciona um jogo ao nosso "Banco de Dados"
app.post('/admin/inserirJogo', (req, res) => {
    const novojogo = req.body;
    lojaDeJogos[novojogo.nome] = novojogo;

    if (typeof(lojaDeJogos[novojogo.nome]) !== "object") return res.status(500).send('Falha interna na criação do jogo no banco de dados')

    res.json(lojaDeJogos)
})

// Altera o preço de umm jogo em nosso "Banco de Dados" a partir do seu nome
app.put('/admin/mudarPreco/', (req, res) => {
  const { nomeJogo, preco } = req.body;
  const jogo = lojaDeJogos[nomeJogo];

  if (!jogo) return res.status(400).send('Este jogo não se encontra no banco');

  jogo["preco"] = preco;

  res.json(jogo);
})

// Deleta uma jogo do "Banco de Dados" a partir do seu nome
app.delete('/admin/deletarJogo/:nomeJogo', (req, res) => {
    const { nomeJogo } = req.params;

    if (!lojaDeJogos.nomeJogo) return res.status(400).send('Este jogo não se encontra no banco');
    
    delete lojaDeJogos[nomeJogo];

    res.json(lojaDeJogos);
})

app.listen(3000, "localhost", function() {
    console.log("Servidor rodando");
})





