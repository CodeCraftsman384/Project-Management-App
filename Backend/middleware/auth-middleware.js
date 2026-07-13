const jwt = require('jsonwebtoken');
const authMiddleware = (req,res,next)=>{
    const token = req.headers['authorisation'];
    if(!(token && token.startsWith('Bearer'))){
        return res.status(401).json({
            success : false,
            message : "No token provided"
        })
    }
    console.log(token.split(" ")[1]);
    try{
        const decodedObj = jwt.verify(token.split(" ")[1],process.env.JWT_SECRET_KEY);
        req.userInfo = decodedObj;
        next();
    }catch(e){
        console.log("Error -> ",e);
        return res.status(500).json({
            success : false,
            message : "Token is incorrect"
        })
    }
}
module.exports = authMiddleware;
