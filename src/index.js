import dotenv from "dotenv";
dotenv.config({
  path:'./.env'
})
import {app} from './app.js'
//import express from "express";
import connectDB from "./db/index.js";
connectDB()
.then(() => {
  app.listen(process.env.PORT || 8001, () => {
    console.log(`server is running at port:${process.env.PORT}`);
  })
})
.catch((err) => {
  console.log("MONGO db connection failed !!! ",err);
})










/*const app =express()
;(async() => {
 try{
   await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
   app.on("error",(error)=>{
    console.log("Error:",error);
    throw error;
   })
   app.listen(process.env.PORT,()=>{
    console.log(`APP is listeninig on port:${process.env.PORT}`);
   })
 }
 catch(error){
    console.log("Error:",error);
    throw error;
 }
})()  // ifeis it execute the function imediatly*/