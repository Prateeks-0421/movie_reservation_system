const express = require("express");
const { checkauth ,  restricttologinuser , restrictto } = require("../middlewares/auth.js") ; 

const router = express.Router();

const {bookingpage , bookingtickets , myreservations , downloadpdf , getallreservations } = require("../controllers/reservation") ; 

router.get("/" ,  myreservations ) ; 

router.get("/all" , getallreservations ) ; 

router.get("/:showid", bookingpage );

router.post("/:showid", bookingtickets );


router.get("/download/:id" , downloadpdf ) ; 

module.exports = router;

