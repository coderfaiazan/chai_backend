import dotenv from "dotenv";
dotenv.config({
  path:'./env'
})


import connectDB from "./db/index.js";
connectDB()











/*const app =express()
;(async() => {
 try{
   await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
   app.on("error",(error)=>{
    console.log("Error:",error);
    throw error;
   })
   app.listen(process.env.PORT,()=>{
    console.log(`APP is listeninig on port${process.env.PORT}`);
   })
 }
 catch(error){
    console.log("Error:",error);
    throw error;
 }
})()   // ifeis it execute the function imediatly*/