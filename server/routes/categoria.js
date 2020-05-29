const express = require('express');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')

let app = express();

let CategoriaModelo = require('../models/categoria.js');

//devuelve todas las categorias
app.get('/categoria', verificaToken, (req, res) => {
    CategoriaModelo.find()
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoria) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            return res.status(200).json({
                ok: true,
                categoria
            });
        });
});

//devuelve categoria por id
app.get('/categoria/:id', verificaToken, (req, res) => {
    //categoria.findById()
    CategoriaModelo.findById(req.params.id).exec((err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            categoria
        });
    });
});

//crea nueva categoria
app.post('/categoria', verificaToken, (req, res) => {
    //devuelve la nueva categoria
    //req.usuario._id
    let query = req.query;

    let categoriaNueva = new CategoriaModelo({
        descripcion: req.query.descripcion,
        usuario: req.usuario._id
    })
    console.log("usuario id" + req.usuario._id);

    categoriaNueva.save((err, cat) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!cat) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: cat
        })
    })
});

//actualiza categoria por id
app.put('/categoria/:id', verificaToken, (req, res) => {
    CategoriaModelo.findByIdAndUpdate(req.params.id, { descripcion: req.query.descripcion }, { new: true, runValidators: true }, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria
        })
    })
});

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    //solo un admin puede borrar categorias
    //categoria.findByIdAndRemove
    CategoriaModelo.findByIdAndRemove(req.params.id, { rawResult: true, runValidators: true }, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: "No existe la categoria"
            })
        }

        res.json({
            ok: true,
            message: "Categoría borrada"
        })
    })
});


module.exports = app;