import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);


    //storage configure 
    const storage= multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null, path.join(__dirname, '../uploads'))
        },
        filename:(req,file,cb)=>{
            const uniquename=Date.now()+"-"+ Math.round(Math.random()* 1e9)+file.originalname;
            cb(null, uniquename);
        }
    });

    const fileFilter=(req,file,cb)=>{
        const allowedTypes=['image/jpeg', 'image/png', 'image/jpg'];
        if(allowedTypes.includes(file.mimetype)){
            cb(null,true);
        }else{
            cb(new Error('Only .jpg, .jpeg, .png files are allowed'), false)
        }
    };

    const upload=multer({
        storage,
        fileFilter,
        limits:{
            fileSize: 5*1024*1024,
        }
    })

export const uploadImageHandler= upload.array('images',5);