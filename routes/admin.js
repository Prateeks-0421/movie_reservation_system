const express = require("express");
const { admindashboard } = require("../controllers/admin");
const { checkauth ,  restricttologinuser , restrictto } = require("../middlewares/auth.js") ; 

const router = express.Router();

router.get("/dashboard", admindashboard);

module.exports = router; 