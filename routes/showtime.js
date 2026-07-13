const express = require("express");
const router = express.Router();

const {addshowtime , postshowtime , deleteshowtime } = require("../controllers/showtime");
const { checkauth ,  restricttologinuser , restrictto } = require("../middlewares/auth.js") ; 


router.get("/add/:movieid",  addshowtime);

router.post("/add/:movieid", postshowtime );

router.get("/:id" , deleteshowtime ) ; 


module.exports = router;