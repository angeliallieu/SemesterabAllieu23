const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection, {
    bucketName: 'posts'
 
});

router.get('/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const downloadStream = bucket.openDownloadStreamByName(filename);

    downloadStream.on("data", (data) => res.status(200).write(data));
    downloadStream.on("error", (err) => res.status(404).send({ message: filename + " does not exist" }));
    downloadStream.on("end", () => res.end());
  } catch (error) {
    console.log('error', error);
    res.send("not found");
  }
});

module.exports = router;
