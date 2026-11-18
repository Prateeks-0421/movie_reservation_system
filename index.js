const express = require("express");

const path = require("path");

const cookieparser = require("cookie-parser") ;

const routes = require("./routes/index.js") ;

require("dotenv").config();

const {checkauth  , restricttologinuser , restrictto } = require("./middlewares/auth") ; 
const session = require("express-session");
const flash = require("connect-flash");

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieparser()) ; 

app.use(express.static("./public"));

app.set("view engine", "ejs");

app.set("views" , path.resolve("./views")) ; 

app.use(checkauth) ; 

app.use(routes) ; 

app.get("/test", (req, res) => {

    res.send(`Process ID : ${process.pid}`);

});

app.get("/" , ( req , res ) => {

      res.render("home") ;  

}) ; 


app.use((req, res) => {

    res.status(404).render("404");

});

 
module.exports = app;