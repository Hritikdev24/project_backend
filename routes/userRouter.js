const express=require("express");
const userRouter=express.Router()
const{loginUser,registerUser}=require("../controllers/userController.js")

//register user

userRouter.post("/register",registerUser)


//login user

userRouter.post("/login",loginUser);




module.exports={userRouter}