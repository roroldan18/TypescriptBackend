"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Token {
    constructor() { }
    static getToken(payload) {
        const token = jsonwebtoken_1.default.sign({
            usuario: payload
        }, this.seed, { expiresIn: this.caducidad });
        return token;
    }
    static checkToken(token) {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, this.seed, (error, decode) => {
                if (error) {
                    return reject(error);
                }
                else {
                    return resolve(decode);
                }
            });
        });
    }
}
Token.seed = 'esteEsElSeed';
Token.caducidad = '30d';
exports.default = Token;
