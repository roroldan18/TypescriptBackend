import {Schema, model, Document} from 'mongoose';
import bcrypt from 'bcrypt';

//1- Creo el Schema del usuario
const usuarioSchema = new Schema ({

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
usuarioSchema.method('compararPassword', function(password:string = ''):boolean {
    {/*@ts-ignore*/} 
    if(bcrypt.compareSync(password, this.password)){
        return true
    }
    else{
        return false
    }
})

// Creo la interfaz para que me reconozca los atributos. Propiedad de TypeScript
interface Iusuario extends Document {
    nombre: string,
    email: string,
    avatar: string,
    password: string,

    compararPassword(password:string):boolean
}

//2- Creo la constante y le asigno el esquema
const Usuario = model<Iusuario>('Usuario', usuarioSchema);

export default Usuario;