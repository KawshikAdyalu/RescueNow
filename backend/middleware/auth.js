const jwt=require('jsonwebtoken')
require('dotenv').config()
const authenticate=(req,res,next)=>{

    const authheader=req.headers.authorization;

    if(!authheader){
        res.status(401).json({message:"Authorization header missing"})
    }

    const token=authheader.split(' ')[1];
    if(!token)
    {
        res.status(401).json({message:"Toke missing"});
    }

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();
    }
    catch(err)
    {
        res.status(401).json({message:"Invalid expired token"})
    }
}

module.exports=authenticate;