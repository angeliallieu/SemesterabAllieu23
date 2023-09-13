const express = require('express');
const router = express.Router();
const Post = require('../models/posts')
const mongoose = require('mongoose')
require('dotenv').config()
const ObjectId = mongoose.Types.ObjectId;
//db = connection


// POST one new post
router.post('/', async(req, res) => {
    
    try {
        const newPost = new Post({
            sdescr: req.body.sdescr,
            notes: req.body.notes,
            image_id: req.body.image_id,
            location: req.body.location,
            audiodata: req.body.audiodata
            
        })
        const result = await newPost.save();
        res.status(201);
        res.send(result);
    } catch {
        res.status(404);
        res.send({
            error: "Post failed!"
        });
    }
});

// GET all posts
router.get('/', async(req, res) => {
    const allPosts = await Post.find();
    res.status(200);
    res.send(allPosts);
});

/* ----------------- GET ---------------------------- */

// function getOnePost(id) {
//     return new Promise( async(resolve, reject) => {
//         try {
            
//             const post = await Post.findById( {_id: id_obj });
//             let fileName = post.image_id;
//             const files = db.collection('posts.files');
//             const chunks = db.collection('posts.chunks');

//             const cursorFiles = files.find({filename: fileName});
//             const allFiles = await cursorFiles.toArray();
//             const cursorChunks = chunks.find({files_id : allFiles[0]._id});
//             const sortedChunks = cursorChunks.sort({n: 1});
//             let fileData = [];
//             for await (const chunk of sortedChunks) {
//                 fileData.push(chunk.data.toString('base64'));
//             }
//             let base64file = 'data:' + allFiles[0].contentType + ';base64,' + fileData.join('');
//             let getPost = new Post({
//                 "title": post.title,
//                 "location": post.location, 
//                 "image_id": base64file
//             });
//             //console.log('getPost', getPost)
//             resolve(getPost)
//         } catch {
//             reject(new Error("Post does not exist!"));
//         }
//     })
// }

// function getAllPosts() {
// 	return new Promise( async(resolve, reject) => {
// 		const sendAllPosts = [];
// 		const allPosts = await Post.find();
// 		try {
// 			for(const post of allPosts) {
// 				// console.log('post', post)
// 				const onePost = await getOnePost(post._id);
// 				sendAllPosts.push(onePost);
// 			}
// 			// console.log('sendAllPosts', sendAllPosts)
// 			resolve(sendAllPosts)
// 		} catch {
// 				reject(new Error("Posts do not exist!"));
//     }
// 	});
// }

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




module.exports = router;
