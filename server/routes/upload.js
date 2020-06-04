const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const UsuarioModelo = require('../models/usuario');
const ProductoModelo = require('../models/producto');
const fs = require('fs');
const path = require('path');

//default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No se ha seleccionado ningún archivo'
        });
    }

    //validar tipo
    let tiposValidos = ['productos', 'usuarios']
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: 'Los tipos permitidos son ' + tiposValidos.join(', ')
        })
    }


    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1];

    //extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: 'Las extensiones permitidas son ' + extensionesValidas.join(', ')
        })
    }

    //cambiar nombre al archivo
    let nombrefichero = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombrefichero}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        //Aquí la imagen ya está cargada
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombrefichero);
        } else {
            imagenProducto(id, res, nombrefichero);
        }
    })

});


function imagenUsuario(id, res, nombreArchivo) {
    UsuarioModelo.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                message: "usuario no existe"
            })
        }

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })
    });
}

function imagenProducto(id, res, nombreArchivo) {
    ProductoModelo.findById(id, (err, prodcutoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!prodcutoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                message: "producto no existe"
            })
        }

        borraArchivo(prodcutoDB.img, 'productos');

        prodcutoDB.img = nombreArchivo;
        prodcutoDB.save((err, productoguardado) => {
            res.json({
                ok: true,
                prodcuto: productoguardado,
                img: nombreArchivo
            })
        })
    })
}

function borraArchivo(nombreImagen, tipo) {
    //verificamos la ruta del archivo
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) { //si existe lo borro
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;