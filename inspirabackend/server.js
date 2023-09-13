const express = require('express');
const postRoutes = require('./routes/post.routes');
require('dotenv').config();
const cors = require('cors')
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
// enable cors for all requests
app.use(cors());
app.use('/posts', postRoutes);


app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`server running on http://localhost:${PORT}`);
    }
});

mongoose.connect(process.env.DB_CONNECTION);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('connected to DB');
});
