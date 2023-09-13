const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    sdescr: String,
    notes: String,
    image_id: String,
    location: String,
    audiodata: String
})

module.exports = mongoose.model('Post', schema);