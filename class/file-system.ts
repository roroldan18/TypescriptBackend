import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';
import { IfileUpload } from '../interfaces/file-upload';

export default class FileSystem {

    constructor(){}

    //Creo el metodo privado SOLO para uso de la case, no puedo llamarlo
    private crearCareptaUsuario (userId:string) {
        const pathUser = path.resolve(__dirname, '../uploads', userId);
        const pathUserTemp = pathUser+"/temp";

        //Valido que la carpeta del usuario ya esté creado.
        const existe:boolean = fs.existsSync(pathUser);
        
        if(!existe){
            //El modulo FS (FileSystem) es para crear archivos o carpetas.-
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }

        return pathUserTemp;
    }

    private generarNombreUnico (nombreOriginal:string):string {
        
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length-1];
        const idUnico = uniqid();

        return `${idUnico}.${extension}`
    }

    guardarImagenTemporal (userId:string, file:IfileUpload):Promise<any> {
        return new Promise((resolve, reject) => {
            const path = this.crearCareptaUsuario(userId); //RUTA DONDE LO VOY A GUARDAR
            const nombreArchivo = this.generarNombreUnico(file.name); //NOMBRE CON EL QUE LO VOY A GUARDAR
            
            //LO GUARDO
            file.mv(`${path}/${nombreArchivo}`, (error:any) => {
                if(error){
                    return reject(error);
                }
                else{
                    return resolve(true);
                }
            })
        })
    }

    private obtenerImagenesTemp(userId:string):Array<string>{
        const pathTemp = path.resolve(__dirname, '../uploads', userId, "temp");
        return fs.readdirSync(pathTemp);
    }

    
    imagenesDeTempHaciaPost (userId:string):Array<string> {

        const pathUserTemp = path.resolve(__dirname, '../uploads', userId, "temp"); //De donde voy a mover la imagen
        const pathUserPost = path.resolve(__dirname, '../uploads', userId, "post"); //Hacia donde la voy a llevar

            //Mover imagenes de TEMP a POST
            const imagenesTemp:Array<string> = this.obtenerImagenesTemp(userId);
            
            imagenesTemp.forEach(imagen => {
                fs.renameSync(`${pathUserTemp}/${imagen}`, `${pathUserPost}/${imagen}`)
            })
            
            return imagenesTemp;

        }


    getFotoUrl(userId:string, img:string):string{
        const pathFoto:string = path.resolve(__dirname, '../uploads', userId, "post", img);

        if(fs.existsSync(pathFoto)){
            return  pathFoto;
        }
        else{
            return path.resolve(__dirname, '../assets/imagen_default.jpg');
        }
    }

}