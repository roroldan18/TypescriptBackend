import {Router, Response, Request, query} from 'express';
import Token from '../class/token';
import { verificarToken } from '../middlewares/authentication';
import jwt from 'jsonwebtoken';
import connection from '../bin/connectionMySql';
import userRoutes from './usuarios';

const userSQLRoutes = Router();

userSQLRoutes.post('/createUser', (req:any, res:Response) => {

    const { nombre, apellido, tipo_documento, numero_documento, nombre_usuario, password } = req.body;

//---------------------OPCION ASYNC AWAIT --------------------------
    

async function crearPersona(){
    const query = connection.query;
        try{
            const transaction = await query("start transaction", []);
            const insertPersonas  = await query("INSERT INTO PERSONAS(NOMBRE, APELLIDO, TIPO_DOCUMENTO, NUMERO_DOCUMENTO) VALUES (?,?,?,?)", [nombre, apellido, tipo_documento, numero_documento]);
            const insertUsuarios  = await query("INSERT INTO USUARIOS(ID_USUARIO, NOMBRE_USUARIO, PASSWORD) VALUES (?,?,?)", [insertPersonas, nombre_usuario, password]);
            const commit = await query("commit");
            res.json({estado: "success", data: commit});
        }
        catch(error){
            const rollback = await query("rollback");
            res.json({estado: "error", data:error, rollback:rollback});
        }
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



})



userSQLRoutes.get('/consultarUsuario', async (req,res) => {

    const numero_documento:string = req.body.numero_documento;

    const persona = await connection.query("SELECT * FROM personas WHERE numero_documento = ?", [numero_documento]);

    res.json({
        data:persona
    })
})



export default userSQLRoutes;

