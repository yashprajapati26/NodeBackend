const db = require('../db');


const showBooks = async(req,res) =>{
    
    let sql = "SELECT * FROM books";
    let query = db.query(sql,(err,rows)=>{
        if(err) throw err;
        res.json(rows);
    });
    
    
};

const addBook = async(req,res) =>{
    let sql = "INSERT INTO books SET ?";
    let query = db.query(sql,(err,rows)=>{
        if(err) throw err;
        res.json("Add Book Sucessfully");
    })
}

module.exports = {showBooks,addBook}