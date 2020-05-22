const express = require('express');
const app = express();
const UsuarioModel = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

app.post('/login', (req, res) => {
    let body = req.body;
    UsuarioModel.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //comprobamos que exista el usuario
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        //comprobamos que la contraseña sea correcta
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, {
            expiresIn: process.env.CADUCIDAD_TOKEN
        });

        res.json({
            ok: true,
            usuarioDB,
            token: token
        })
    })
})

module.exports = app;