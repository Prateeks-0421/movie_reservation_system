const express = require("express");
const authroutes = require("./auth.js");
const movieroutes = require("./movie.js");
const reservationroutes = require("./reservation.js");
const adminroutes = require("./admin.js");
const showtimeroutes = require("./showtime.js") ; 
const  { restricttologinuser , restrictto } = require("../middlewares/auth.js") ;
const paymentroutes= require("./payment.js") ; 
const otproutes = require("./otp") ; 
const router = express.Router();

router.use("/auth", authroutes);
router.use("/movies", movieroutes);
router.use("/reservations",  restricttologinuser , reservationroutes );
router.use("/admin", restricttologinuser , restrictto("ADMIN") , adminroutes);
router.use("/showtimes" , restricttologinuser , restrictto("ADMIN") , showtimeroutes ) ; 
router.use("/payment", restricttologinuser , paymentroutes ) ; 
router.use("/otp" , otproutes ) ; 

module.exports = router ;
