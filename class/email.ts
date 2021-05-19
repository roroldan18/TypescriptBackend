import nodemailer from 'nodemailer';
import path from 'path';

export class EmailClass {

    host:string = "smtp.gmail.com"
    port:number = 587
    secure:boolean = false
    tls:boolean = false

    auth = {
        user: 'testing.utn.ba@gmail.com',
        pass: 'testing1234**'
    }

    constructor(){

    }

    enviarEmail(cuentaCorreoDesinto:string, asunto:string, cuerpoEmail:string, html:string = "") {


        return new Promise((resolve, reject) => {


            const transporter = nodemailer.createTransport({
                host: this.host,    
                port: this.port,    
                secure: this.secure,    
                auth:{    
                    user: this.auth.user,    
                    pass: this.auth.pass    
                },    
                tls:{    
                    rejectUnauthorized: this.tls    
                }               
            })


    
            const mailOptions = {
                from: this.auth.user,
                to: cuentaCorreoDesinto,
                subject: asunto,
                text: cuerpoEmail,
                html: html,
                //agrego adjuntos de forma optativa
                attachments: [{
                    path: path.resolve(__dirname, '../assets', 'imagen_default.jpg')
                }
                ]
            }
    
            nodemailer.createTestAccount((error) => {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error){
                        reject(error);
                    }
                    else{
                        return resolve(info)
                        console.log(info)
                    }
                });
            })

        })

        
    }
}