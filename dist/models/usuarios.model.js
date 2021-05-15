"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
//1- Creo el Schema del usuario
const usuarioSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es requerido']
    },
    password: {
        type: String,
        required: [true, 'La clave es requerida']
    },
    avatar: {
        type: String,
        default: 'av-1.png'
    }
});
//Funcion Metod del objeto esquema --> Me permite CREAR FUNCIONES dentro de un esquema, para luego poder usarla dentro de cualquier esquema.
//el ts-ignore lo que hace es eliminar un problema de typescript
usuarioSchema.method('compararPassword', function (password = '') {
    { /*@ts-ignore*/ }
    if (bcrypt_1.default.compareSync(password, this.password)) {
        return true;
    }
    else {
        return false;
    }
});
//2- Creo la constante y le asigno el esquema
const Usuario = mongoose_1.model('Usuario', usuarioSchema);
exports.default = Usuario;
