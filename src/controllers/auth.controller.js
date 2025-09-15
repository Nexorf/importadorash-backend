// import ResponseHandler from "../utils/responsehandler.js";

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta_super_segura';
const USERNAME = 'admin@importadorash.com';
const PASSWORD = 'ImportadoraSH2025';


const usuario = [
    {
        id: 1,
        username: USERNAME,
        password: PASSWORD,
        role: 'admin'
    },

]


const AuthController = {

    login: async (req, res) => {
        try {
            const {username, password} = req.body;

            if (!username || !password) {
                return res.response.badRequest(res, 'Usuario y contraseña requeridos');
            }

            const user = usuario.find(u => u.username === username);

            if (!user) {
                return res.response.notFound(res, 'Usuario o Contraseña incorrecta');
            }

            if (user.password !== password) {
                return res.response.notFound(res, '  Contraseña incorrecta');
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                },
                JWT_SECRET,
                {expiresIn: '1h'}
            );

            res.response.success(res, 'Login exitoso', token);

        } catch (error) {
            console.log(error);
            res.response.serverError(res, 'Error en el servidor', error);
        }
    },

    verify: async (req, res) => {
        try {
            const {token} = req.body;
            if (!token) {
                return res.response.badRequest(res, 'Token requerido');
            }

            const decoded = jwt.verify(token, JWT_SECRET);
            res.response.success(res, 'Token válido', {valid: true, user: decoded});

        } catch (error) {
            res.response.success(res, 'Token inválido', {valid: false});
        }
    }
}

export default AuthController;