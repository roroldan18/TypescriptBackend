import {Router, Response, Request} from 'express';
import Usuario from '../models/usuarios.model';
import bcrypt from 'bcrypt';
import Token from '../class/token';
import { verificarToken } from '../middlewares/authentication';



//Creo una variable para almacenarle todos los metodos de Router.- Router es una funcion, no una clase por eso no pongo NEW
const userRoutes = Router();

//Creo un GET, le paso un path y luego un callback (Req - request // res - Respuesta).
//Es una buena práctica definir el tipado, ya que me permite acceder a todos los metodos luego.
//Entonces la respuesta va a devolver un JSON con estado y mensaje.
userRoutes.get('/prueba', (req:Request, res:Response) => {
    res.json({
        estado: 'success',
        mensaje: 'OK'
    })
});

// Con el parametro req, es donde almacenamos todo lo que nos mandan en una peticion
//1- SERVICIO PARA CREAR USUARIOS
userRoutes.post('/create', (req: Request, res:Response) => {
    
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    }

    Usuario.create(user)
        .then(result => {
            res.json({
                estado: 'success',
                mensaje: result
            })
        })
        .catch(error => {
            res.json({
                estado: 'error',
                mensaje: error
            })
        })

})

//2- Servicio para el LOGIN

userRoutes.post('/login', (req:Request, res: Response) => {
    
    Usuario.findOne({email: req.body.email}, null, null, (error, result) => {
        if(error) {
            throw error;
        }
        if(!result){
            return res.json({
                estado: 'success',
                mensaje: 'Usuario no encontrado en base de datos',
                data: result
            })
        }

        if(result.compararPassword(req.body.password)){

            const tokenJwt = Token.getToken({
                id: result.id,
                nombre: result.nombre,
                email: result.email,
                avatar: result.avatar
            })

            return res.json({
                estado: 'success',
                mensaje: 'Usuario encontrado',
                data: result,
                token: tokenJwt
            })
        }
        else {
            return res.json({
                estado: 'success',
                mensaje: 'Usuario no encontrado en base de datos',
                data: result
            })
        }
    })
})


userRoutes.put('/update', verificarToken, (req: any, res:Response) => {
    

    //Validacion por si no me manda todos los datos
    let user:any = {};
    const atributos = ['nombre', 'email', 'avatar', 'password'];

    atributos.forEach(item => {
        if(req.body[item] != null){
            if(item == 'password'){
                user[item] = bcrypt.hashSync(req.body[item], 10)    
            }
            else{
                user[item] = req.body[item]
            }
        }
    });
    
    
    Usuario.findByIdAndUpdate(req.usuario.id, user, {new: true}, (error, result) => {
        if(error){
            throw error
        }
        if(!result) {
            res.json({
                estado: 'success',
                mensaje: 'Usuario no existe en la base'
            })
        }
        else{

            res.json({
                estado: 'success',
                data: result,
                refreshToken: req.token,
            })
        }
    } )
})



export default userRoutes;