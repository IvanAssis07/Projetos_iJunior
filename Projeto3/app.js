const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require('./db');
const Usuario = require('./models/usuario');
const Jogo = require('./models/jogo');

require('dotenv-safe').config();
const app = express();

app.use(express.json());

// Para acessar as rotas (menos a 'inserirUsuario') é preciso alterar x-access-token presente no header,  
// este token é um JWT que é gerado ao realizar o login.

// CREATE
app.post('/inserirJogo', verificarJWT, async (req, res, next) => {
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
        // Criptografando a senha, usando um salt 10
        const hashedSenha = await bcrypt.hash(senha, 10);
        await Usuario.create({
            nome: nome,
            email : email,
            senha : hashedSenha
            });
        res.status(201).send("Inseriu usuário.");
    } catch(error) {
        res.sendStatus(500);
    }
});

// READ
app.get('/checarUsuario/:id', verificarJWT, async (req, res, next) => {
    const { id } = req.params;
    await database.sync();

    try{
        const usuario = await Usuario.findByPk(id);

        if (!usuario) return res.status(404).send('Não há um usuario com este id no servidor.');
        res.status(201).send(usuario);
    } catch(error) {
        next(error);
    }
})

app.get('/checarJogo/:id', verificarJWT, async (req, res, next) => {
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
app.get('/checarUsuarioJogos/:id', verificarJWT, async (req, res, next) => {
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
app.post('/alterarSenhaUsuario', verificarJWT, async (req, res, next) => {
    const { id, senha } = req.body;
    await database.sync();

    try{
        const usuario = await Usuario.findByPk(id);
        const hashedSenha = await bcrypt.hash(senha, 10);
        usuario.senha = hashedSenha;

        const usuarioAlterado = await usuario.save();
        res.status(201).send(usuarioAlterado);
    } catch(error) {
        next(error);
    }
})

app.post('/alterarPrecoJogo', verificarJWT, async (req, res, next) => {
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
app.delete('/deletarJogo/:id', verificarJWT, async (req, res, next) => {
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

app.delete('/deletarUsuario/:id', verificarJWT, async (req, res, next) => {
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

// Rota de autenticação de usuário
// usuário loga com email e senha (a qual foi criptografada com Bcrypt)
app.post('/usuario/login', async (req, res, next) => {
    const { email, senha } = req.body;
    await database.sync();

    try{
        const usuario = await Usuario.findOne({ where: { email: email }});

        // Checando se há um usuário no banco com esse email
        if (!usuario) {
            return res.status(400).send('usuário não cadastrado ou email incorreto');
        }
        
        if (await bcrypt.compare(senha, usuario.senha)) {
            // Assinando JWT (obs.: evitar colocar dados sensívei como payload)
            const token = jwt.sign({userId: usuario.id}, process.env.SECRET, {expiresIn: 600});
            res.status(201).send('Você logou com sucesso!' + '\nSegue seu token:' + token);
        } else {
            res.status(400).send('Confira a senha digitada.');
        }
    } catch(error) {
        next(error);
    }
})

// Middleware de autenticação do token que é gerado em cada login
function verificarJWT(req, res, next) {
    const token = req.headers['x-access-token'];

    // Checando se o token é inválido devido ao logout do usuario
    const index = blackList.findIndex(item => item === token);
    if (index !== -1) return res.status(401).send('Token inválido');

    if (!token) return res.status(401).send('Nenhum token foi fornecido.');
    
    jwt.verify(token, process.env.SECRET, (err, tokenDecodificado) => {
        if (err) return res.status(500).send('Token inválido');

        req.id = tokenDecodificado.userId;
        next();
    })
}

// Criando uma lista que vai conter todos os tokens que se tornorão inválidas
// após a rota 'logout' for chamada
const blackList = [];

app.post('/usuario/logout', (req, res) => {
    blackList.push(req.headers['x-access-token']);
    res.send('Logout bem sucedido');
})

// Middleware de erro que será usado por todas operações que apresentarem 
// algum mau funcionamento em nossa aplicação.
app.use((error, req, res, next) => {
    console.log('error');
    res.sendStatus(500);
});

app.listen(3000, () => {
    console.log("Rodando...");
});
