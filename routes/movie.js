const express = require("express");
const {addmovie , getmovie , viewmovie , deletemovie } = require("../controllers/movie") ; 
const { checkauth ,  restricttologinuser , restrictto } = require("../middlewares/auth.js") ; 
// const {upload} = require("../middlewares/upload") ;

const router = express.Router();

router.get("/", getmovie );

router.get("/add" , restricttologinuser , restrictto("ADMIN") , ( req , res ) => {

 res.render("addmovie") ; 

}) ; 

const upload = require("../middlewares/upload");

router.post(
    "/add",
    upload.single("posterurl") , restricttologinuser , restrictto("ADMIN") , addmovie
);

router.get("/:id" , viewmovie ) ; 

router.post("/delete/:id" , restricttologinuser , restrictto("ADMIN") , deletemovie ) ; 

module.exports = router;

