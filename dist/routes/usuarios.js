"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarios_model_1 = __importDefault(require("../models/usuarios.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../class/token"));
const authentication_1 = require("../middlewares/authentication");
const email_1 = require("../class/email");
//Creo una variable para almacenarle todos los metodos de Router.- Router es una funcion, no una clase por eso no pongo NEW
const userRoutes = express_1.Router();
//Creo un GET, le paso un path y luego un callback (Req - request // res - Respuesta).
//Es una buena práctica definir el tipado, ya que me permite acceder a todos los metodos luego.
//Entonces la respuesta va a devolver un JSON con estado y mensaje.
userRoutes.get('/prueba', (req, res) => {
    res.json({
        estado: 'success',
        mensaje: 'OK'
    });
});
userRoutes.get('/', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuario = req.usuario;
    const email = new email_1.EmailClass();
    const emailInfo = yield email.enviarEmail("rodrigo.roldan18@gmail.com", "envio_email", "Cuerpo de email", "<h1>Hola mundo</h1>");
    res.json({
        estado: 'success',
        mensaje: usuario,
        emailInfo: emailInfo
    });
}));
// Con el parametro req, es donde almacenamos todo lo que nos mandan en una peticion
//1- SERVICIO PARA CREAR USUARIOS
userRoutes.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };
    const emailEnvio = new email_1.EmailClass();
    //OPCION 1 PARA ENVIAR MAIL AL CREAR UN USUARIO
    /*await emailEnvio.enviarEmail(user.email, "Creacion cuenta", "su cuenta se ha creado con exito", ""); */
    //Con ASYNC AWAIT
    /*     const result = await Usuario.create(user);
        const envio = await emailEnvio.enviarEmail(user.email, "Creacion cuenta", "su cuenta se ha creado con exito", "");
    
        res.json({
            estado: 'success',
            mensaje: result,
            emailResult: envio
        }) */
    //CON PROMESAS
    usuarios_model_1.default.create(user)
        .then(result => {
        const envio = emailEnvio.enviarEmail(user.email, "Creacion cuenta", "su cuenta se ha creado con exito", "");
        res.json({
            estado: 'success',
            mensaje: result,
            emailresult: envio
        });
    })
        .catch(error => {
        res.json({
            estado: 'error',
            mensaje: error
        });
    });
}));
//2- Servicio para el LOGIN
userRoutes.post('/login', (req, res) => {
    usuarios_model_1.default.findOne({ email: req.body.email }, null, null, (error, result) => {
        if (error) {
            throw error;
        }
        if (!result) {
            return res.json({
                estado: 'success',
                mensaje: 'Usuario no encontrado en base de datos',
                data: result
            });
        }
        if (result.compararPassword(req.body.password)) {
            const tokenJwt = token_1.default.getToken({
                id: result.id,
                nombre: result.nombre,
                email: result.email,
                avatar: result.avatar
            });
            return res.json({
                estado: 'success',
                mensaje: 'Usuario encontrado',
                data: result,
                token: tokenJwt
            });
        }
        else {
            return res.json({
                estado: 'success',
                mensaje: 'Usuario no encontrado en base de datos',
                data: result
            });
        }
    });
});
userRoutes.put('/update', authentication_1.verificarToken, (req, res) => {
    //Validacion por si no me manda todos los datos
    let user = {};
    const atributos = ['nombre', 'email', 'avatar', 'password'];
    atributos.forEach(item => {
        if (req.body[item] != null) {
            if (item == 'password') {
                user[item] = bcrypt_1.default.hashSync(req.body[item], 10);
            }
            else {
                user[item] = req.body[item];
            }
        }
    });
    usuarios_model_1.default.findByIdAndUpdate(req.usuario.id, user, { new: true }, (error, result) => {
        if (error) {
            throw error;
        }
        if (!result) {
            res.json({
                estado: 'success',
                mensaje: 'Usuario no existe en la base'
            });
        }
        else {
            res.json({
                estado: 'success',
                data: result,
                refreshToken: req.token,
            });
        }
    });
});
exports.default = userRoutes;
