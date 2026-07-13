const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const  { setuser , getuser  } = require("../services/auth") ; 
const {client} = require("../client.js") ; 
 
function getsignup(req , res ){
res.render("signup") ; 
}

function getlogin(req , res ){
res.render("login") ;   
}

async function postsignup(req , res ){
   
   try {  

          const body = req.body ; 
    
   if(!body.name || !body.email || !body.password ){
      return res.status(400).render("signup", {
        error: "all fields are required "
    });
   }

   if(body.password.length < 6){
     
         return res.status(400).render("signup", {
        error: "password length must be atleast 6 character long"
    });

   }

   const existingUser = await prisma.user.findUnique({
    where: {
        email: body.email.trim()
    }
});

 if(existingUser){
    return res.status(400).render("signup", {
        error: "User already exists"
    });
}

       const hashedpassword = await bcrypt.hash(body.password , 10 ) ; 

      await prisma.user.create({
        data : {
           name : body.name.trim() , 
           email : body.email.trim() , 
           password : hashedpassword 
        }
      }) ; 
   }
    catch(error){

      return res.status(500).render("signup" , { error : "some error encountered "}) ; 


    }

    res.redirect("/auth/login") ; 

}

async function postlogin(req , res ){

    try{

         const body = req.body ; 
    
   if(!body.email || !body.password ){
      return res.status(400).render("login", {
        error: "all fields are required "
    });
   }

   const newuser = await prisma.user.findUnique({
    where: {
        email: body.email.trim()
    }
   });

   if(!newuser){

   return res.status(400).render("login" , { error : "user doesnt exist "}) ; 

   }
   
    const flag = await bcrypt.compare( body.password , newuser.password ) ; 

    if(!flag){
        
       return  res.status(400).render("login" , { error : "Invalid Email or Password"}) ; 
    }
       
     const token = setuser(newuser) ;

    res.cookie("token", token, {
    httpOnly: true
});  

   console.log(req.cookies?.token) ; 
     
    res.redirect("/");
    }
    catch(error){
            console.log(error) ; 
           return  res.status(500).render("login" , { error : "some error occured"}) ;     
    }
}
 
async function postlogout(req , res ){


 await client.set(`token:${req.cookies?.token}` , 1 , { EX : 86400}) ; 

  res.clearCookie("token") ; 
  res.redirect("/") ; 

}


module.exports = { getsignup , getlogin , postsignup , postlogin , postlogout } ; 