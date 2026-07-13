const express = require("express") ; 
const router = express.Router() ; 

const  { getsignup , getlogin , postsignup , postlogin , postlogout  }  = require("../controllers/auth.js") ; 
const { checkauth ,  restricttologinuser , restrictto } = require("../middlewares/auth.js") ; 

const  { ratelimiterlogin  , ratelimitersignup , ratelimitercreateorder , ratelimiterverifyorder , ratelimiteraddmovie , ratelimiterdeletemovie } = require("../middlewares/ratelimiter")  ;

router.get("/login" , getlogin ) ; 

router.get("/signup" , getsignup ) ; 

router.post("/signup" , ratelimitersignup , postsignup ) ; 

router.post("/login" , ratelimiterlogin ,  postlogin ) ; 

router.get("/logout" , restricttologinuser ,  postlogout ) ; 

module.exports = router ; 


