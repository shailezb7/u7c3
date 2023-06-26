let jwt = require('jsonwebtoken');

let auth=async (req,res,next) =>{
    let token= req.headers?.authorization.split(" ")[1];
    if(!token){
        res.status(400).send({message:'Please insert token!'});
    }
    else{
        let decode= jwt.verify(token,process.env.SECRET_KEY);
        if(decode){
            req.userID=decode.userID;
            next();
        }
        else{
            res.send({message:'Token verfying failed'});
        }
    }
}

module.exports={auth};