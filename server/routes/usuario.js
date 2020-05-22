const express = require('express');
const app = express();
const UsuarioModel = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')

app.get('/usuario', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    UsuarioModel.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            UsuarioModel.count({ estado: true }, (err, numtotal) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: numtotal
                })
            })

        });
});


app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {
    let query = req.query;

    let usuario = new UsuarioModel({
        nombre: query.nombre,
        email: query.email,
        password: bcrypt.hashSync(query.password, 10),
        role: query.role
    });

    //guardamos en base de datos
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});


app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let query = _.pick(req.query, ['nombre', 'email', 'img', 'role', 'estado']);

    //usamos el modelo
    UsuarioModel.findByIdAndUpdate(id, query, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });


});

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;

    //ELIMINANDO EL REGISTRO EN LA DB
    /* UsuarioModel.findByIdAndRemove(id, (err, usuarioborrado) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }
        if (usuarioborrado) {
            res.json({
                ok: true,
                usuario: usuarioborrado
            });
        } else {
            res.status(400).json({
                ok: false,
                err: {
                    message: "usuario no encontrado"
                }
            });
        }

    }) */

    //ACTUALIZANDO EL ESTADO A FALSE
    UsuarioModel.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuario) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        } else {
            res.json({
                ok: true,
                usuario: usuario
            });
        }
    })

});

module.exports = app;