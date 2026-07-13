const express = require("express") ; 
const router = express.Router();

const { handleotpverification } = require("../controllers/otp") ; 

router.post("/setotp" , handleotpverification ) ; 

module.exports = router ; 