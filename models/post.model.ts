import {Schema, model, Document} from 'mongoose';

const postSchema = new Schema ({

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
        type: Schema.Types.ObjectId,
        ref:'Usuario',
        require:[true, "El Usuario es obligatorio"]
    },

});



postSchema.pre('save', function(next){
    //@ts-ignore
    this.created = new Date();
    next();
})

// Creo la interfaz para que me reconozca los atributos. Propiedad de TypeScript
interface Ipost extends Document {
    created: Date,
    mensaje: string,
    imp: string,
    coords: string,
    usuario: string

}

//2- Creo la constante y le asigno el esquema
const Post = model<Ipost>('Post', postSchema);

export default Post;