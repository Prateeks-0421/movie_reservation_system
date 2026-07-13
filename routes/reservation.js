const express = require("express");
const { checkauth ,  restricttologinuser , restrictto } = require("../middlewares/auth.js") ; 

const router = express.Router();

const {bookingpage , bookingtickets , myreservations , downloadpdf } = require("../controllers/reservation") ; 

router.get("/:showid", bookingpage );

router.post("/:showid", bookingtickets );

router.get("/" ,  myreservations ) ; 

router.get("/download/:id" , downloadpdf ) ; 

module.exports = router;

