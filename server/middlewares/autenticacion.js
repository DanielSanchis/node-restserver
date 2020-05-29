const jwt = require('jsonwebtoken');
//====================
// VERIFICAR TOKEN
//====================

let verificaToken = (req, res, next) => {
    let token = req.get('token'); //o autorizarion, en función de como se pase en el header
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Token no válido"
                }
            })
        }
        req.usuario = decoded.usuario; //el decoded es el payload
        next();
    })
};


//====================
// VERIFICAR ADMIN ROLE
//====================
let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: "No eres usuario administrador"
            }
        })
    }
}

module.exports = {
    verificaToken,
    verificaAdminRole
}