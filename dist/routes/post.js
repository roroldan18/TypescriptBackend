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
const authentication_1 = require("../middlewares/authentication");
const post_model_1 = __importDefault(require("../models/post.model"));
const file_system_1 = __importDefault(require("../class/file-system"));
//Instancio la clase FileSystem
const fileSystem = new file_system_1.default();
const postRouter = express_1.Router();
postRouter.post('/', authentication_1.verificarToken, (req, res) => {
    const body = req.body;
    body.usuario = req.body.usuario._id;
    const imagenes = fileSystem.imagenesDeTempHaciaPost(req.usuario._id);
    body.img = imagenes;
    post_model_1.default.create(body)
        .then((postDb) => __awaiter(void 0, void 0, void 0, function* () {
        yield postDb.populate('usuario').execPopulate();
        res.json({
            estado: "success",
            data: postDb
        });
    }));
});
postRouter.get('/imagen/:userId/:img', (req, res) => {
    //Enviar datos por params en la URL
    const userId = req.params.userId;
    const img = req.params.img;
    const foto = fileSystem.getFotoUrl(userId, img);
    res.sendfile(foto);
});
postRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1; //Esto es info que está en la URL
    let skip = pagina - 1;
    skip = skip * 10; //Este numero depende del limit, entonces te trae los primeros 10 y si le paso la página 2, va a saltar los primeros 10 y me va a traer los otros.
    const post = yield post_model_1.default.find()
        .sort({ _id: -1 }) //Esto es para ordenar los registros, -1 es en forma descendente.
        .limit(10) //Limit es para limitar la cantidad de registros
        .skip(skip) //Es para hacer saltos de página.
        .populate('usuario') //el populate lo que hace es traer los datos de la tabla usuario
        .exec(); //Comando obligatorio al final
    res.json({
        estado: "success",
        data: post
    });
}));
postRouter.post('/upload', authentication_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const imagen = req.files.imagen;
    //VALIDO QUE ME HAYA ENVIADO EL ARCHIVO
    if (!req.files) {
        return res.status(400).json({
            estado: "error",
            mensaje: "No se subio ningun archivo",
        });
    }
    //valido que sea tipo imagen
    const validacion = imagen.mimetype.includes('image');
    if (!validacion) {
        return res.status(400).json({
            estado: "error",
            mensaje: "No se subió un archivo de imagen"
        });
    }
    //Guardo la imagen temporal --> NECESITO HACER EL METODO SINCRONO. ES DECIR, NECESITO QUE SEA PROMESA.-
    yield fileSystem.guardarImagenTemporal(req.usuario.id, imagen);
    res.json({
        estado: "success",
        data: imagen
    });
}));
exports.default = postRouter;
