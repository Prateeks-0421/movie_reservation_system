const  prisma = require("../config/prisma");
const  { setuser , getuser  } = require("../services/auth") ; 

const {client } = require("../client") ; 


async function handleotpverification(req , res){

    const body = req.body ; 

if(!body.otp || !body.email) return res.render("verifyotp" , { email: body.email , error : "please enter the  otp "}) ; 

const user = await prisma.user.findUnique( { where : {email : body.email} }) ; 

if( !user ) {
     return res.render("otp" , {email: body.email , error : "enter the valid email "}) ; 
}
 
const storedotp = await client.get(`otp:${user.email}`) ; 

if( storedotp !== body.otp ){
   return res.render("otp" , { error : "otp doesnt match " , email : body.email }) ; 
}


const deleted = await client.del(`otp:${user.email}`);
const token = setuser(user) ;

res.cookie("token" , token ) ;

return res.redirect("/") ; 

}


module.exports =  {handleotpverification } ; 