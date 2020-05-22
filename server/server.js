require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

//como es un middleware, se ejecuta siempre que pasa por aqui
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//configuracion local de rutas
app.use(require('./routes/index'));

//mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
mongoose.connect(process.env.URLDB, (err, res) => {
    //para definir un callback para decir si ha funcionado o no la conexión
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto ', process.env.PORT);
});