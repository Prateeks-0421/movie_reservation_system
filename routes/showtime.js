const express = require("express");
const router = express.Router();

const {addshowtime , postshowtime } = require("../controllers/showtime");
const { checkauth ,  restricttologinuser , restrictto } = require("../middlewares/auth.js") ; 


router.get("/add/:movieid",  addshowtime);


router.post("/add/:movieid", postshowtime );


module.exports = router;