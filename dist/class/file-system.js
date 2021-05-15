"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    //Creo el metodo privado SOLO para uso de la case, no puedo llamarlo
    crearCareptaUsuario(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads', userId);
        const pathUserTemp = pathUser + "/temp";
        //Valido que la carpeta del usuario ya esté creado.
        const existe = fs_1.default.existsSync(pathUser);
        if (!existe) {
            //El modulo FS (FileSystem) es para crear archivos o carpetas.-
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    generarNombreUnico(nombreOriginal) {
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        const idUnico = uniqid_1.default();
        return `${idUnico}.${extension}`;
    }
    guardarImagenTemporal(userId, file) {
        return new Promise((resolve, reject) => {
            const path = this.crearCareptaUsuario(userId); //RUTA DONDE LO VOY A GUARDAR
            const nombreArchivo = this.generarNombreUnico(file.name); //NOMBRE CON EL QUE LO VOY A GUARDAR
            //LO GUARDO
            file.mv(`${path}/${nombreArchivo}`, (error) => {
                if (error) {
                    return reject(error);
                }
                else {
                    return resolve(true);
                }
            });
        });
    }
    obtenerImagenesTemp(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads', userId, "temp");
        return fs_1.default.readdirSync(pathTemp);
    }
    imagenesDeTempHaciaPost(userId) {
        const pathUserTemp = path_1.default.resolve(__dirname, '../uploads', userId, "temp"); //De donde voy a mover la imagen
        const pathUserPost = path_1.default.resolve(__dirname, '../uploads', userId, "post"); //Hacia donde la voy a llevar
        //Mover imagenes de TEMP a POST
        const imagenesTemp = this.obtenerImagenesTemp(userId);
        imagenesTemp.forEach(imagen => {
            fs_1.default.renameSync(`${pathUserTemp}/${imagen}`, `${pathUserPost}/${imagen}`);
        });
        return imagenesTemp;
    }
    getFotoUrl(userId, img) {
        const pathFoto = path_1.default.resolve(__dirname, '../uploads', userId, "post", img);
        if (fs_1.default.existsSync(pathFoto)) {
            return pathFoto;
        }
        else {
            return path_1.default.resolve(__dirname, '../assets/imagen_default.jpg');
        }
    }
}
exports.default = FileSystem;
