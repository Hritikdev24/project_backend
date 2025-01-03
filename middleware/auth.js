const jwt = require("jsonwebtoken");

const key = process.env.JWT_SECRETE;

 function auth(req, res, next){
  try{
    const token = req.headers.authorization.split(" ")[1]
 
  if (token){
  
    try {
      var decoded = jwt.verify(token, key);
      req.body.userId = decoded.data;
    
      next();
    } catch (err) {
      console.log(err);
      res.status(400).json({ success: false, message: "invalide token" });
    }
  } else {
    res.status(400).json({ success: false, message: "invalide token" });
  }
  }catch(err){
    console.log(err);
    res.status(400).json({ success: false, message: "invalide token" });

  }
}

module.exports = { auth };
