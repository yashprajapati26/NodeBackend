require("dotenv").config();

const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const multer = require('multer');
const session = require('express-session');
const cookieParser = require('cookie-parser')

const userRoutes = require('./routes/userRoutes');
const db = require('./db');
const {v4:uuidv4} = require('uuid');

const app = express(); 

// use cors for allow request from any another port by '*'
app.use(cors({origin:"*"}));

app.use(bodyParser.json());

app.use(cookieParser());

// use session 
app.use(session({
    secret:uuidv4(),
    resave:false,
    saveUninitialized:false
})
);


// use multer for image store 
const storage = multer.diskStorage({
    destination: (req,file,callback)=>{
        callback(null,'./uploads/')
    },
    filename: (req,file,callback)=>{
        callback(null,'book_' + file.originalname)
    }
})

const upload = multer({storage:storage})

// const upload = multer({dest:'./uploads/'})




app.get('/', (req,res) => {
    res.send('App Works !!!!');    
});


// just create for upload book with image but didn't work properly

app.post('/api/upload_book', upload.single("file") , async(req,res) => {
    file = req.file;
    console.log(file)
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const book_image = file.path;

    console.log("----------------------------------------------------");
    body = {'title':title,'price':price,'description':description,'book_image':book_image}
    if(body){
        let sql = "INSERT INTO books SET ?";
        
        let query = db.query(sql,body,(err,rows)=>{
            if(err) throw err;
            res.json({"msg":"data added"});
        })
    }
    else{res.json({"msg":"please select file"})}
})

app.use('/api',userRoutes)
 
const port = process.env.PORT
app.listen(port, 
()=> console.log(`Server Started on port ${port}...`));



