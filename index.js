const express=require("express");
const cors=require("cors");
const dotenv =require("dotenv");
dotenv.config(); 
const port=process.env.PORT||4000;
const{foodRouter}=require("./routes/foodRouter.js")
const {dbConnect}=require("./connection/dbConnection.js")
const{userRouter}=require("./routes/userRouter.js")
const{orderRouter} =require("./routes/orderRouter.js")
//app configuration
const app=express();
const{cartRouter}=require("./routes/cartRouter.js")
//app middleware

app.use(express.urlencoded({extended:true}));
app.use(express.json());
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // If using cookies or auth headers
}));
app.use( "/images",express.static("uploads"))

//dataBase configuration
dbConnect();

app.get("/",(req,res)=>{
    res.status(200).json({message:"Hi From The Server"});
})

app.use("/food",foodRouter);
app.use("/cart",cartRouter);
app.use("/user",userRouter);
app.use("/order",orderRouter)
app.listen(port,()=>{
    console.log(`server has been started at port number :${port}`);
});












