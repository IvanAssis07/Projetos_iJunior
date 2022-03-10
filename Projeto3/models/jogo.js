const Sequelize = require('sequelize');
const database = require('../db');
const Usuario = require('./usuario');

const Jogo = database.define('jogo', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ano: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    preco:{ 
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    genero:{ 
        type: Sequelize.STRING,
        allowNull: false
    }
});

// Criando chave estrangeira 1-N
Usuario.hasMany(Jogo, {
    foreignKey : 'idUsuario'
})

module.exports = Jogo;