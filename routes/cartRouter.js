const{addCart,removeCart,cartDa,clear} =require("../controllers/cartController.js");
const express=require("express");
const cartRouter=express.Router();
const{auth}=require('../middleware/auth.js')



cartRouter.use(auth);

cartRouter.post("/add",addCart);


cartRouter.post("/remove",removeCart);
cartRouter.get("/list",cartDa);
cartRouter.post("/clear",clear);

module.exports={cartRouter}