const express = require("express") ; 
const router = express.Router() ; 

const  { getsignup , getlogin , postsignup , postlogin , postlogout  }  = require("../controllers/auth.js") ; 
const { checkauth ,  restricttologinuser , restrictto } = require("../middlewares/auth.js") ; 

router.get("/login" , getlogin ) ; 

router.get("/signup" , getsignup ) ; 

router.post("/signup" , postsignup ) ; 

router.post("/login" , postlogin ) ; 

router.get("/logout" , restricttologinuser ,  postlogout ) ; 

module.exports = router ; 


