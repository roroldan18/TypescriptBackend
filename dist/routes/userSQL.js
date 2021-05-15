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
const connectionMySql_1 = __importDefault(require("../bin/connectionMySql"));
const userSQLRoutes = express_1.Router();
userSQLRoutes.post('/createUser', (req, res) => {
    const { nombre, apellido, tipo_documento, numero_documento, nombre_usuario, password } = req.body;
    //---------------------OPCION ASYNC AWAIT --------------------------
    function crearPersona() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = connectionMySql_1.default.query;
            try {
                const transaction = yield query("start transaction", []);
                const insertPersonas = yield query("INSERT INTO PERSONAS(NOMBRE, APELLIDO, TIPO_DOCUMENTO, NUMERO_DOCUMENTO) VALUES (?,?,?,?)", [nombre, apellido, tipo_documento, numero_documento]);
                const insertUsuarios = yield query("INSERT INTO USUARIOS(ID_USUARIO, NOMBRE_USUARIO, PASSWORD) VALUES (?,?,?)", [insertPersonas, nombre_usuario, password]);
                const commit = yield query("commit");
                res.json({ estado: "success", data: commit });
            }
            catch (error) {
                const rollback = yield query("rollback");
                res.json({ estado: "error", data: error, rollback: rollback });
            }
        });
    }
    crearPersona();
    //INSERT INTO PERSONAS 
    /* connection.query('INSERT INTO PERSONAS(NOMBRE, APELLIDO, TIPO_DOCUMENTO, NUMERO_DOCUMENTO) VALUES (?, ?, ?, ?)', [nombre, apellido, tipo_documento, numero_documento], (error, result)=>{
        if(error){
            console.log(error)
        }
        else{
            console.log(result)
        }
    }) */
});
userSQLRoutes.get('/consultarUsuario', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const numero_documento = req.body.numero_documento;
    const persona = yield connectionMySql_1.default.query("SELECT * FROM personas WHERE numero_documento = ?", [numero_documento]);
    res.json({
        data: persona
    });
}));
exports.default = userSQLRoutes;
