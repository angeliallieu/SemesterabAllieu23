const express = require('express');
const postRoutes = require('./routes/post.routes');
// const uploadRoutes = require('./routes/upload.routes');
// const downloadRoutes = require('./routes/download.routes');
require('dotenv').config();
const cors = require('cors')

const app = express();
const PORT = 4000;
const mongoose = require('mongoose');



app.use(express.json());
// enable cors for all requests
app.use(cors());
app.use('/posts', postRoutes);
// app.use('/upload', uploadRoutes);
// app.use('/download', downloadRoutes);

app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`server running on http://localhost:${PORT}`);
    }
});

// connect to mongoDB, um Daten den Datenbank geheim zu halten
mongoose.connect(process.env.DB_CONNECTION);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('connected to DB');
});