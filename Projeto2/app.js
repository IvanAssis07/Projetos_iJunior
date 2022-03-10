const express = require('express');
const database = require('./db');
const Usuario = require('./models/usuario');
const Jogo = require('./models/jogo');

const app = express();

app.use(express.json());


// CREATE
app.post('/inserirJogo', async (req, res, next) => {
    const {nome, ano, preco, genero, idUsuario} = req.body;
    await database.sync();
    try{
        await Jogo.create({
            nome : nome,
            ano : ano,
            preco : preco,
            genero : genero,
            idUsuario: idUsuario
        });
    
        res.status(201).send("Inseriu jogo.");
    } catch (error) {
        next(error);
    }
    
})

app.post('/inserirUsuario', async (req, res,next) => {
    const {nome, email, senha} = req.body;
    await database.sync();

    try{
        await Usuario.create({
            nome: nome,
            email : email,
            senha : senha
            });
        res.status(201).send("Inseriu usuário.");
    } catch(error) {
        res.sendStatus(500);
    }
});


// READ
app.get('/checarUsuario/:id', async (req, res, next) => {
    const { id } = req.params;
    await database.sync();

    try{
        const usuario = await Usuario.findByPk(id);
        res.status(201).send(usuario);
    } catch(error) {
        next(error);
    }
})

app.get('/checarJogo/:id', async (req, res, next) => {
    const { id } = req.params;
    await database.sync();

    try{
        const jogo = await Jogo.findByPk(id);
        res.status(201).send(jogo);
    } catch (error) {
        next(error);
    }
})

// Retornando todos os jogos associados a um usuário específico
app.get('/checarUsuarioJogos/:id', async (req, res, next) => {
    const { id } = req.params;
    await database.sync();

    try{
        // Eager Loading
        const usuario = await Usuario.findByPk(id, {include: Jogo});

        // Lazy Loading
        // const usuario = await Usuario.findByPk(id);
        // const jogos = await usuario.getJogos();
        res.status(201).send(usuario.jogos);
    } catch(error) {
        next(error);
    }
})


// UPDATE
app.post('/alterarSenhaUsuario', async (req, res, next) => {
    const { id, senha } = req.body;
    await database.sync();

    try{
        const usuario = await Usuario.findByPk(id);
        usuario.senha = senha;

        const usuarioAlterado = await usuario.save();
        res.status(201).send(usuarioAlterado);
    } catch(error) {
        next(error);
    }
})

app.post('/alterarPrecoJogo', async (req, res, next) => {
    const { id, preco } = req.body;
    await database.sync();

    try{
        const jogo = await Jogo.findByPk(id);
        jogo.preco = preco;
    
        const jogoAlterado = await jogo.save();
        res.status(201).send(jogoAlterado);
    } catch(error) {
        next(error);
    }
})


//DELETE
app.delete('/deletarJogo/:id', async (req, res, next) => {
    const { id } = req.params;
    await database.sync();

    try{
        await Jogo.destroy({
            where : {
                id : id,
            }
        })
    
        const jogo = await Jogo.findAll();
        res.status(201).send(jogo);
    } catch(error) {
        next(error);
    }
});

app.delete('/deletarUsuario/:id', async (req, res, next) => {
    const { id } = req.params;
    await database.sync();

    try{
        await Usuario.destroy({
            where : {
                id : id,
            }
        })
    
        const usuario = await Usuario.findAll();
        res.status(201).send(usuario);
    } catch(error) {
        next(error);
    }
});

// Middleware de erro que será usado por todas operações que apresentarem 
// algum mau funcionamento em nossa aplicação.
app.use((error, req, res, next) => {
    console.log('error');
    res.sendStatus(500);
});

app.listen(3000, () => {
    console.log("Rodando...");
});
