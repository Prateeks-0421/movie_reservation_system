const express = require("express");
const {addmovie , getmovie , viewmovie , deletemovie , getcomments , postcomments } = require("../controllers/movie") ; 
const { checkauth ,  restricttologinuser , restrictto } = require("../middlewares/auth.js") ; 
const  { ratelimiterlogin  , ratelimitersignup , ratelimitercreateorder , ratelimiterverifyorder , ratelimiteraddmovie , ratelimiterdeletemovie } = require("../middlewares/ratelimiter")  ;
// const {upload} = require("../middlewares/upload") ;

const router = express.Router();

router.get("/", getmovie );

router.get("/add" , restricttologinuser , restrictto("ADMIN") ,  ( req , res ) => {

 res.render("addmovie") ; 

}) ; 

const upload = require("../middlewares/upload");

router.post(
    "/add",
    upload.single("posterurl") , restricttologinuser , restrictto("ADMIN") ,ratelimiteraddmovie , addmovie
);

router.get("/:id" , viewmovie ) ; 

router.post("/delete/:id" , restricttologinuser , restrictto("ADMIN") , ratelimiterdeletemovie , deletemovie ) ;

router.get("/comments/:id" , getcomments ) ; 
router.post("/comments/:id" , postcomments )

module.exports = router;

