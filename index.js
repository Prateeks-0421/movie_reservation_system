const express = require("express");

const path = require("path");

const cookieparser = require("cookie-parser") ;

const routes = require("./routes/index.js") ;

require("dotenv").config();

const {checkauth  , restricttologinuser , restrictto } = require("./middlewares/auth") ; 

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieparser()) ; 

app.use(express.static("./public"));

app.set("view engine", "ejs");

app.set("views" , path.resolve("./views")) ; 

app.use(checkauth) ; 

app.use(routes) ; 

app.use("/" , ( req , res ) => {

      res.render("home") ; 

}) ; 
 
module.exports = app;