const { client } = require("../client");

async function ratelimiterlogin(req , res , next ){

 const count = await client.get(`login:${req.ip}`) ; 

if(!count){
    await client.set(`login:${req.ip}` , 1 , { EX : 60 }) ; 
    return next() ; 
}
const newcount = await client.incr(`login:${req.ip}`) ; 

 if( newcount > 3 ) {
    return res.render("login" , { error : "too many request , try again after sometime "}); 
 }

 next() ; 

} 
async function ratelimitersignup(req , res , next ){

 const count = await client.get(`signup:${req.ip}`) ; 

if(!count){
    await client.set(`signup:${req.ip}` , 1 , { EX : 60 }) ; 
    return next() ; 
}
const newcount = await client.incr(`signup:${req.ip}`) ; 

 if( newcount > 3 ) {
   return res.render("signup" , { error : "too many request , try again after sometime "}); 
 }

 next() ; 

} 

async function ratelimitercreateorder(req , res , next ){

 const count = await client.get(`createorder:${req.ip}`) ; 
 console.log("sab badiyaa" ) ; 

if(!count){
    await client.set(`createorder:${req.ip}` , 1 , { EX : 300 }) ; 
    return next() ; 
}
const newcount = await client.incr(`createorder:${req.ip}`) ; 

 if( newcount > 3 ) {
  return res.status(429).json({
    success: false,
    message: "Too many requests"
});
 }

 next() ; 

} 

async function ratelimiterverifyorder(req , res , next ){

 const count = await client.get(`verifyorder:${req.ip}`) ; 

if(!count){
    await client.set(`verifyorder:${req.ip}` , 1 , { EX : 300 }) ; 
    return next() ; 
}
const newcount = await client.incr(`verifyorder:${req.ip}`) ; 

 if( newcount > 3 ) {
    return res.status(429).json({ error : "too many request "}) ; 
 }

 next() ; 

} 

async function ratelimiteraddmovie(req , res , next ){

 const count = await client.get(`addmovie:${req.ip}`) ; 

if(!count){
    await client.set(`addmovie:${req.ip}` , 1 , { EX : 3600 }) ; 
    return next() ; 
}
const newcount = await client.incr(`addmovie:${req.ip}`) ; 

 if( newcount > 5 ) {
    return res.status(429).json({ error : "too many request "}) ; 
 }

 next() ; 

} 

async function ratelimiterdeletemovie(req , res , next ){

 const count = await client.get(`deletemovie:${req.ip}`) ; 

if(!count){
    await client.set(`deletemovie:${req.ip}` , 1 , { EX : 3600 }) ; 
    return next() ; 
}
const newcount = await client.incr(`deletemovie:${req.ip}`) ; 

 if( newcount > 5 ) {
    return res.status(429).json({ error : "too many request "}) ; 
 }

 next() ; 

} 



module.exports = { ratelimiterlogin  , ratelimitersignup , ratelimitercreateorder , ratelimiterverifyorder , ratelimiteraddmovie , ratelimiterdeletemovie } ;  