const express = require("express");
const { createorder , verifypayment , paymentsuccess , paymentfailed } = require("../controllers/payment.js");

const router = express.Router();
const  { ratelimiterlogin  , ratelimitersignup , ratelimitercreateorder , ratelimiterverifyorder , ratelimiteraddmovie , ratelimiterdeletemovie } = require("../middlewares/ratelimiter")  ;


router.post("/create-order/:id", ratelimitercreateorder , createorder);
router.post("/verify" , ratelimiterverifyorder , verifypayment ) ; 

router.get("/success/:id" , paymentsuccess) ; 
router.get("/failed" , paymentfailed ) ; 

module.exports = router;