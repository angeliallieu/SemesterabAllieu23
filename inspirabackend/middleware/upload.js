const multer = require('multer');
const { 
    GridFsStorage 
} = require('multer-gridfs-storage');
const mongoose = require('mongoose');

require('dotenv').config();




const storage = new GridFsStorage({
    // db: mongoose.connection,
    url: process.env.DB_CONNECTION,
    options: { 
        dbName: "Inspira"},
    file: (req, file) => {
        const match = ["image/png", "image/jpg", "image/jpeg"];

        if(match.indexOf(file.mimetype) === -1){
            console.log('file.mimetype === -1')
            return `${Date.now()}-aa-${file.originalname}`;
        }

       
        return {

            bucketName: 'posts',
            filename: `${Date.now()}-aa-${file.originalname}`,
            request: req
        };
    },
});



  module.exports = multer({ storage });
