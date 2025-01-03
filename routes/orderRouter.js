const express=require("express");
const {auth}=require("../middleware/auth.js")
const{placeOrder,verifyPayment,orderList,menuList,orderStatus}=require("../controllers/orderController.js")
const orderRouter=express.Router();




orderRouter.post("/list",auth,orderList);

orderRouter.post("/payment",auth,placeOrder);
orderRouter.post("/verify-payment",auth,verifyPayment);
orderRouter.get("/menu-list",menuList);
orderRouter.post("/status",orderStatus)






module.exports={orderRouter}