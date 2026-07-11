const { setuser , getuser } = require("../services/auth") ; 

async function checkauth(req , res , next ){

    const token = req.cookies?.token ; 
    // const token = res.headers.authorization?.split(' ')[1] ; 

    if(!token){
        return next() ; 
    }

    try{
       const user = getuser(token) ;
       req.user = user ; 
       res.locals.user = user;

    }
    catch(error){
         console.log(error) ;  
          res.clearCookie("token");
    }
    
    return next() ; 
}

function restricttologinuser(req, res, next) {

    if (!req.user) {
        return res.redirect("/auth/login");
    }

    next();
}

function restrictto(...role){
    return  function (req , res , next) {

        if (!role.includes(req.user.role) ) {
        return res.status(403).send('access denied');
    }

    next();

    }
}

module.exports = { checkauth ,  restricttologinuser , restrictto } ; 
