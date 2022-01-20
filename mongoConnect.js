const mongoose = require('mongoose');



mongoose.connect('mongodb://localhost:27017/finalLecture').then(()=>{
    console.log("connected")
    });