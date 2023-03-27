require('dotenv').config();
const express= require('express');
const mongoose = require("mongoose");
const app = express();
const cors = require('cors');
//corsOptions
//winston
const PORT = process.env.PORT ||3500;
const logger = require('./logger/logger');
const cookieParser = require('cookie-parser');
const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConn');
const credentials = require('./middleware/credentials');
// const port = 3500;
connectDB();

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
    res.send('Hello World!');
  });


  
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});