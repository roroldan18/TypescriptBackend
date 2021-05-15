"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    mensaje: {
        type: String
    },
    img: {
        type: String
    },
    coords: {
        type: String
    },
    //El usuario lo creo indicandole que es un Foreign ID
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        require: [true, "El Usuario es obligatorio"]
    },
});
postSchema.pre('save', function (next) {
    //@ts-ignore
    this.created = new Date();
    next();
});
//2- Creo la constante y le asigno el esquema
const Post = mongoose_1.model('Post', postSchema);
exports.default = Post;
