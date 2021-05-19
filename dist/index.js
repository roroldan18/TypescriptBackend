"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./class/server"));
const connectionMySql_1 = __importDefault(require("./bin/connectionMySql"));
const usuarios_1 = __importDefault(require("./routes/usuarios"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const userSQL_1 = __importDefault(require("./routes/userSQL"));
const post_1 = __importDefault(require("./routes/post"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
//Creando servidor web
const server = new server_1.default();
//Inicio el servidor
server.start(() => {
    console.log(`Servidor corriendo en puerto ${server.puerto} y en host ${server.host}`);
});
const pathUploads = path_1.default.resolve(__dirname, 'uploads');
if (!fs_1.default.existsSync(pathUploads)) {
    fs_1.default.mkdirSync(pathUploads);
}
//Incorporo el Body Parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//Agrego librería para permitirle al Backend recibir files:
server.app.use(express_fileupload_1.default());
//RUTAS APLICACION
//Cada vez que alguien use la ruta /users, va a ejecutar el userRoutes --> localhost:3000/users/prueba
server.app.use('/users', usuarios_1.default);
server.app.use('/userSQL', userSQL_1.default);
server.app.use('/post', post_1.default);
//Conexion database MySQL del archivo connection
connectionMySql_1.default.connect((error) => {
    if (error) {
        throw error;
    }
    else {
        console.log('Aplicacion conectada a base de datos MySQL');
    }
});
//Conexion a mongoose
mongoose_1.default.connect('mongodb://localhost:27017/appCurso_ProgWebAvanzada', { useNewUrlParser: true, useCreateIndex: true }, (error) => {
    if (error) {
        throw error;
    }
    else {
        console.log('Aplicacion conectada a base de datos Mongo');
    }
});
