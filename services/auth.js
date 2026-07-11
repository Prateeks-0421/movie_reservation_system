const jwt = require("jsonwebtoken") ; 


function setuser(user){

    const payload = {
        id: user.id ,
        name :  user.name , 
        email : user.email , 
        role : user.role , 
        
    }

    return jwt.sign(payload , process.env.JWTSECRET , {
    expiresIn: "7d"
}) ; 

}

function getuser(token){
    return jwt.verify(token , process.env.JWTSECRET) ; 
}

module.exports = { setuser , getuser  } ; 