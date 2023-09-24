const multer = require('multer');
const { 
    GridFsStorage 
} = require('multer-gridfs-storage');
const mongoose = require('mongoose');
//const posts = require('../models/posts');
// const mongoose = require('mongoose');
require('dotenv').config();
//const bucketName = 'posts';

//const credentials = process.env.PATH_TO_PEM
//const mongoose = require('mongoose');
//const db = mongoose.connection;



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

        //console.log('store', storage);
        return {

            bucketName: 'posts',
            filename: `${Date.now()}-aa-${file.originalname}`,
            request: req
        };
    },
});

//console.log('store', storage)
// storage.on('connection', (db) => {
//     // Db is the database instance
//     console.log('storage on')
//     module.exports = multer({ storage });
//   });
  
//   storage.on('connectionFailed', (err) => {
//     // err is the error received from MongoDb
//     console.log('failed');
//   });

  module.exports = multer({ storage });
