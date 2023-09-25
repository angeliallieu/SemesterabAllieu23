const express = require('express');
const router =  express.Router();
const Post =  require('../models/posts');
const upload =  require('../middleware/upload');
// const upload = multer({ dest: '../middleware/upload'});
const multer = require('multer');
const mongoose = require('mongoose');
require('dotenv').config();
// const ObjectId = mongoose.Types.ObjectId;
//db = connection
db = mongoose.connection;



// POST one new post
// router.post('/', upload.single("file"), async(req, res) => {
//     // req.files._id = date.Now();
//     try {
//         const newPost = new Post({
//             sdescr: req.body.sdescr,
//             notes: req.body.notes,
//             image_id: req.body.image_id,
//             location: req.body.location,
//             audiodata: req.body.audiodata
            
//         })
//         const result = await newPost.save();
//         res.status(201);
//         res.send(result);
//     } catch {
//         res.status(404);
//         res.send({
//             error: "Post failed!"
//         });
//     }
// });

router.post('/', upload.single('file'), async (req, res) => {
    // Die upload.single-Middleware wird zuerst aufgerufen, um das Bild hochzuladen.
    // Danach kannst du auf die Dateiinformationen über req.file zugreifen.
    
    // Hier kannst du auf req.file zugreifen, um die Dateiinformationen zu erhalten.
    if (req.file === undefined) {
      return res.send({ "message": "keine Datei ausgewählt" });
    } else {
      // Hier kannst du die new Post()-Funktion aufrufen und die Dateiinformationen verwenden.
      const newPost = new Post({
        sdescr: req.body.sdescr,
        notes: req.body.notes,
        image_id: req.file.filename, // Du kannst req.file.filename verwenden, um den Dateinamen zu erhalten.
        location: req.body.location,
        audiodata: req.body.audiodata
      });
  
      try {
        const result = await newPost.save();
        res.status(201).send({ url: `http://localhost:4000/download/${req.file.filename}` });
      } catch (error) {
        res.status(500).send({ error: "Fehler beim Erstellen des Beitrags" });
      }
    }
  });

// GET all posts
router.get('/', async(req, res) => {
    const allPosts = await Post.find();
    res.status(200);
    res.send(allPosts);
});

/* ----------------- GET ---------------------------- */

const credentials = process.env.DB_CONNECTION;

const connection = mongoose.createConnection(process.env.DB_CONNECTION, { 
    dbName: "Inspira" });

function getOnePost(id) {
    return new Promise( async(resolve, reject) => {
        try {

            const post = await Post.findOne({ _id: id });
            let fileName = post.image_id;
            const files = connection.collection('posts.files');
            const chunks = connection.collection('posts.chunks');

            const cursorFiles = files.find({filename: fileName});
            const allFiles = await cursorFiles.toArray();
            const cursorChunks = chunks.find({files_id : allFiles[0]._id});
            const sortedChunks = cursorChunks.sort({n: 1});
            let fileData = [];
            for await (const chunk of sortedChunks) {
                fileData.push(chunk.data.toString('base64'));
            }
            let base64file = 'data:' + allFiles[0].contentType + ';base64,' + fileData.join('');
            let getPost = new Post({
                "sdescr": post.sdescr,
                "notes": post.notes,
                "image_id": base64file,
                "location":post.location,
                "audiodata": post.audiodata
            });
            resolve(getPost)
        } catch {
            reject(new Error("Post does not exist!"));
        }
    })
}

function getAllPosts() {
	return new Promise( async(resolve, reject) => {
		const sendAllPosts = [];
		const allPosts = await Post.find();
		try {
			for(const post of allPosts) {
				// console.log('post', post)
				const onePost = await getOnePost(post._id);
				sendAllPosts.push(onePost);
			}
			// console.log('sendAllPosts', sendAllPosts)
			resolve(sendAllPosts)
		} catch {
				reject(new Error("Posts do not exist!"));
    }
	});
}

// GET one post by id
router.get('/:id', async(req, res) => {

    try {
        const id_obj = new ObjectId(req.params.id);
        const post = await Post.findById( {_id: id_obj });
        console.log('post', req.params.id)
        res.status(202);
        res.send(post);
    } catch {
        res.status(404);
        res.send({
            error: "Post does not exist 123!"
        });
    }
});

/* ----------------- DELETE ---------------------------- */
// router.delete('/:id', async(req, res) => {
//     const id = req.params.id;
//     try {
//         await bucket.delete(new ObjectId(id));
//         console.log('result', result)
//         res.status(200).send({ message: "deleted"})
//     } catch (error) {
//         console.log('error', error);
//         res.status(404).send({ message: "id " + id + " does not exist" });
//     }
// });

// DELETE one post via id
router.delete('/:id', async(req, res) => {
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
        res.status(404)
        res.send({ error: "Post does not exist!" })
    }
});




module.exports = router;
