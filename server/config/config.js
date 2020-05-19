//===================
// Puerto
//===================

process.env.PORT = process.env.PORT || 3000;

//===================
// Entorno
//===================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//===================
// Base de datos
//===================

let urlDB;

/* if (process.env.NODE_ENV === 'dev') {
    urlDB = "mongodb://localhost:27017/cafe";
} else { */
urlDB = "mongodb+srv://cafe-user:123456daniel@cluster0-pyuyt.mongodb.net/test?retryWrites=true&w=majority";
/* } */

process.env.URLDB = urlDB;