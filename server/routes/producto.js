const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion')
let app = express();
let ProductoModelo = require('../models/producto.js');


//obtener todo los productos
//trae todos los productos
//populate: usuario, categoria
//paginado
app.get('/productos', verificaToken, (req, res) => {
    let limite = req.query.limite || 5;
    limite = Number(limite);
    ProductoModelo.find({ disponible: true }) //solo vamos a coger los disponibles
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .limit(limite)
        .exec((err, listaproductos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!listaproductos) {
                return res.status(400).json({
                    ok: false,
                    message: "no hay productos"
                })
            }

            return res.json({
                ok: true,
                listaproductos
            })
        })
});

//obtener un prodcuto por id
app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    ProductoModelo.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    message: "no existe el prodcuto"
                })
            }

            return res.json({
                ok: true,
                producto
            })
        })


})

//Buscar productos
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i'); //expresión regular, 'i' para que no sea case sensitive
    ProductoModelo.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                productos
            })
        })
})



//crear un nuevo producto
//grabar el usuario
//grabar nueva categoria
app.post('/productos', verificaToken, (req, res) => {
    let nombre = req.query.nombre;
    let precioUni = req.query.precioUni;
    let descripcion = req.query.descripcion;
    let disponible = req.query.disponible;
    let categoria = req.query.categoria;
    let usuario = req.usuario;

    let nuevoProducto = new ProductoModelo({
        nombre,
        precioUni,
        descripcion,
        disponible,
        categoria,
        usuario
    });
    //console.log(nuevoProducto);
    nuevoProducto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.status(201).json({
            ok: true,
            productoDB
        })

    })
})


//actualizar producto
app.put('/productos/:id', verificaToken, (req, res) => {
    let nombre = req.query.nombre;
    let precioUni = req.query.precioUni;
    let descripcion = req.query.descripcion;
    let disponible = req.query.disponible;
    let categoria = req.query.categoria;

    /* ProductoModelo.findByIdAndUpdate(req.params.id, { nombre, precioUni, descripcion, disponible, categoria, usuario }, { new: true, runValidators: true }, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria
        });
    }); */
    ProductoModelo.findById(req.params.id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: "El producto no existe."
            })
        }

        productoDB.nombre = nombre;
        productoDB.precioUni = precioUni;
        productoDB.descripcion = descripcion;
        productoDB.disponible = disponible;
        productoDB.categoria = categoria;
        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                producto: productoGuardado
            })
        })


    })
});


//elimiar producto
//en vez de borrarlo fisicamente cambiar el flag de disponible
app.delete('/productos/:id', verificaToken, (req, res) => {

    ProductoModelo.findByIdAndUpdate(req.params.id, { disponible: false }, { new: true, runValidators: true }).exec((err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria
        });
    });
});

module.exports = app;