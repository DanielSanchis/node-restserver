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

if (process.env.NODE_ENV === 'dev') {
    urlDB = "mongodb://localhost:27017/cafe";
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//===================
// vencimiento del token
//===================
process.env.CADUCIDAD_TOKEN = '48h';


//===================
// SEED de autenticación
//===================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


//===================
// google client ID
//===================

process.env.CLIENT_ID = process.env.CLIENT_ID || '326761882761-6dpi15dedsk4ouudvr8d6argbsohera5.apps.googleusercontent.com';