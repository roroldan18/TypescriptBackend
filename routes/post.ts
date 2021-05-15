import { Router, Response } from "express";
import { IfileUpload } from "../interfaces/file-upload";
import { verificarToken } from "../middlewares/authentication";
import Post from "../models/post.model";
import FileSystem from '../class/file-system';

//Instancio la clase FileSystem
const fileSystem = new FileSystem();

const postRouter = Router();



postRouter.post('/', verificarToken, (req:any, res:Response) => {
    const body = req.body;

    body.usuario = req.body.usuario._id;

    const imagenes:Array<string> = fileSystem.imagenesDeTempHaciaPost(req.usuario._id);

    body.img = imagenes;

    Post.create(body)
        .then(async postDb => {

            await postDb.populate('usuario').execPopulate();

            res.json({
                estado: "success",
                data: postDb
            })
        })

})

postRouter.get('/imagen/:userId/:img', (req:any, res: Response) => {
    //Enviar datos por params en la URL

    const userId = req.params.userId;
    const img = req.params.img;

    const foto = fileSystem.getFotoUrl(userId, img);

    res.sendfile(foto);

})

postRouter.get('/', async (req:any, res:Response) => {

    let pagina = Number(req.query.pagina) || 1; //Esto es info que está en la URL
    let skip = pagina -1;
    skip = skip*10; //Este numero depende del limit, entonces te trae los primeros 10 y si le paso la página 2, va a saltar los primeros 10 y me va a traer los otros.

    const post = await Post.find()
                                .sort({_id: -1})  //Esto es para ordenar los registros, -1 es en forma descendente.
                                .limit(10) //Limit es para limitar la cantidad de registros
                                .skip(skip) //Es para hacer saltos de página.
                                .populate('usuario') //el populate lo que hace es traer los datos de la tabla usuario
                                .exec(); //Comando obligatorio al final
    
    res.json({
        estado: "success",
        data: post
    })

})




postRouter.post('/upload', verificarToken, async (req:any, res:Response) => {

    const imagen:IfileUpload = req.files.imagen;

    //VALIDO QUE ME HAYA ENVIADO EL ARCHIVO
    if(!req.files){
        return res.status(400).json({
            estado:"error",
            mensaje:"No se subio ningun archivo",
        })
    }

    //valido que sea tipo imagen
    const validacion = imagen.mimetype.includes('image');

    if(!validacion){
        return res.status(400).json({
            estado:"error",
            mensaje:"No se subió un archivo de imagen"
        })
    }

    //Guardo la imagen temporal --> NECESITO HACER EL METODO SINCRONO. ES DECIR, NECESITO QUE SEA PROMESA.-
    await fileSystem.guardarImagenTemporal(req.usuario.id, imagen);


    res.json({
        estado: "success",
        data: imagen
    })

})



export default postRouter;