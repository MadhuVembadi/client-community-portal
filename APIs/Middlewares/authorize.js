const jwt = require('jsonwebtoken');
require('dotenv').config();

function authorize(req,res,next){
    
    token = req.cookies.jwt;
    // console.log(token);
    if(token){
        jwt.verify(token,process.env.SECRET_KEY,(err,decodedToken) => {
            // console.log(decodedToken);
            if(err){
                if(err.message == "jwt expired"){
                    res.send({message:'session expired'});
                }
                // console.log(err.message);
                res.send({message:"unauthorized access"})
                // res.redirect('/login');
            }
            else{
                // console.log(decodedToken);
                next();
            }
        })
    }
    else{
        res.send({message:"unauthorized access"})
        // res.redirect('/login')
    }
}

module.exports = {authorize}