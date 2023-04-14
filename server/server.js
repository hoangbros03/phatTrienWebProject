/*
This is a project for web development subject made by UET students
To make it work, please do the following instruction:
Create file .env, add PORT, DATABASE_URL
Type 'npm init', then 'npm run dev'
*/



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
const errorHandler=require('./middleware/errorHandler');
// const port = 3500;
connectDB();

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());

//TODO: Create app.use that serve static files
//app.use('/', express.static(path.join(__dirname, '/public')));

//TODO: Create app.use that routes

//TODO: Create verifyJWT

//TODO: Create API 
app.use('/cucDangKiem',require('./routes/api/cucDangKiem'));

app.use('/trungTamDangKiem', require('./routes/api/trungTamDangKiem'));



//if no match with any thing else (should never happen)
app.all('*', (req, res) => {
  //TODO: Make 404 page and add here
    res.send('Hello World!');
  });


//to handle any error happen
app.use(errorHandler);
  
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});