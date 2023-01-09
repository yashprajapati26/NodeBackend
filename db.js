const mysql = require('mysql');

const db = mysql.createPool({
    connectionLimit: 100,
    host: "127.0.0.1",       
    user: "root",         
    password: "",  
    database: "db_test",      
    port: "3306"
 })                   
 //Connect your NodeJS App to your mySQL DB

 
db.getConnection( (err, connection)=> {
    if (err) throw (err)
    console.log ("DB connected successful: " + connection.threadId)
});


module.exports = db;
