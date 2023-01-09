require('dotenv').config()
const bcrypt = require("bcrypt")
const db = require('../db');
const jwt = require('jsonwebtoken');
let jwtSecretKey = process.env.ACCESS_TOKEN_SECRET


const signupUser = async(req,res) =>{
    const fullname =req.body.fullname;
    const email = req.body.email;
    const password = req.body.password
    // const hashedPassword = await bcrypt.hash(password,10);
    // console.log("--->",email,hashedPassword);
    body = {fullname:fullname, email:email, password:password}
    
    // console.log(hashedPassword)
    let sql = "INSERT INTO users SET ?";
    let query = db.query(sql,body,(err,rows)=>{
        if(err) throw res.json(err);
        
        res.json({"msg":"insert data sucessfully"});
    });
    
};

const loginUser = async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    console.log(email, password);
    body = {email:email, password:password}

    let sql = `SELECT * FROM users WHERE email = "${email}"`;
    let user_obj;

    db.query(sql, async(err, rows) => {
        if(err) throw err;
        console.log(rows);
        user_obj = rows[0];
        console.log("user_obj : ",user_obj)

        if(user_obj){
            // result = await bcrypt.compare(password, user_obj.password)
            // console.log("result : ",result)
            if(password == user_obj.password){

                // generate token 
                const token = jwt.sign(email, jwtSecretKey);
                console.log("client toekn :",token);

                req.session.user = user_obj.email;

                //save into user cookie 
                res.cookie("auth_token", token, {
                    maxAge: 2629800000,
                    httpOnly: true,
                });

                console.log(res.cookie)
                res.json({"user_type":user_obj.user_type,"msg":"Login Sucessfully"});
            }
            else{
                res.json({"msg":"Username and password not match"});
            }
        }
        else{
            res.json({"msg":"Email is not register with us"});
        }
    })

}

const authenticateToekn = async(req, res, next) => {
   
    const token = req.cookies.auth_token
    
    console.log("111111111111",token)

    // const token = authHeader && authHeader.split(' ')[1]  // token place on 2nd position

    if(token==null) return res.sendStatus(401)

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err, res) =>{
        if(err) return res.sendStatus(403)
        req.user = res
        next()
    })
}

const logoutUser = async (req, res) => {
    req.session.destroy((err)=>{
        if(err){
            console.log(err);
            res.json("Error")
        }else{
            res.status(200).send({message:"Logout Sucessfully"})
        }
    })
}

const userDetails = async(req,res) => {
    
    db.query(`SELECT * FROM users`,async(err, rows) => {
        if(err) throw err;
        const users=rows;

        if(users){
            res.json({"users":users});
        }

    });
    

}

module.exports = {signupUser,loginUser,logoutUser,userDetails,authenticateToekn}