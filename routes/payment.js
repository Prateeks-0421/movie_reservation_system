const express = require("express");
const { createorder , verifypayment } = require("../controllers/payment.js");

const router = express.Router();

router.post("/create-order/:id", createorder);
router.post("/verify" , verifypayment ) ; 

module.exports = router;