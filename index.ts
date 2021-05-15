import Server from './class/server';
import connection from './bin/connectionMySql';
import userRoutes from './routes/usuarios';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import userSQLRoutes from './routes/userSQL';
import postRouter from './routes/post';
import fileUpload from 'express-fileupload';

//Creando servidor web
const server = new Server();


//Inicio el servidor
server.start(() => {
    console.log(`Servidor corriendo en puerto ${server.puerto} y en host ${server.host}`)
});

//Incorporo el Body Parser
server.app.use(bodyParser.urlencoded({extended:true}));
server.app.use(bodyParser.json());

//Agrego librería para permitirle al Backend recibir files:
server.app.use(fileUpload());

 
//RUTAS APLICACION
//Cada vez que alguien use la ruta /users, va a ejecutar el userRoutes --> localhost:3000/users/prueba
server.app.use('/users', userRoutes);
server.app.use('/userSQL', userSQLRoutes);
server.app.use('/post', postRouter);


//Conexion database MySQL del archivo connection
connection.connect( (error) => {
    if (error){
        throw error
    }
    else {
        console.log('Aplicacion conectada a base de datos MySQL');
    }
});


//Conexion a mongoose
mongoose.connect('mongodb://localhost:27017/appCurso_ProgWebAvanzada', 
                    {useNewUrlParser:true, useCreateIndex:true},
                    (error) => {
                        if(error){
                            throw error
                        }
                        else {
                            console.log('Aplicacion conectada a base de datos Mongo');
                        }
                    }
)