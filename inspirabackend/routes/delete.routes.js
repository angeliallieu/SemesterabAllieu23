const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//const { database } = mongoose.connection;
// const  ObjectId = require('mongoose').ObjectId
const ObjectId = mongoose.Types.ObjectId;

const connection = mongoose.createConnection(process.env.DB_CONNECTION, { 
    dbName: "Inspira" });

const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection, {
    bucketName: 'posts'
 
});

// DELETE one post via id
router.delete('/:id', async(req, res) => {
   const id = req.params.id;
    try {
        const post = await Post.findOne({ _id: req.params.id })
        let fileName = post.image_id;
        await Post.deleteOne({ _id: req.params.id });
        await files.find({filename: fileName}).toArray( async(err, docs) => {
            await chunks.deleteMany({files_id : docs[0]._id});
        })
        await files.deleteOne({filename: fileName});
        res.status(204).send()
    } catch {
        // res.status(404)
        // res.send({ error: id + " does not exist!" })
        res.status(404).send({ message: "id" + id + " does not exist" });
    }
});

// router.delete('/:id', async(req, res) => {
//     const id = req.params.id;
//     try {
//         await bucket.delete(new ObjectId(id));
//         // console.log('result', result)
//         res.status(200).send({ message: "deleted"})
//     } catch (error) {
//         console.log('error', error);
//         res.status(404).send({ message: "id" + id + " does not exist" });
//     }
// });

module.exports = router;