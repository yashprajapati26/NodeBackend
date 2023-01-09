const express = require('express');
const {signupUser,loginUser,logoutUser,userDetails,authenticateToekn} = require('../controllers/userController');
const {showBooks,addBook} = require('../controllers/booksController');
const router = express.Router()

// router.route('/').post(signupUser);
router.post("/signup",signupUser);
router.get("/books",showBooks);
router.post("/login",loginUser);
router.get("/logout",logoutUser);
router.get("/userdetails",authenticateToekn, userDetails);

// router.get("/add_book",addBook);



module.exports = router