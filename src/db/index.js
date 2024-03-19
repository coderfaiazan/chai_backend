import mongoose from "mongoose";
import { DB_NAME } from "../constant.js"; 
const connectDB = async () => {
    try{
      const connectioninstance =  await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
       console.log(`\n MongoDB connected !! DB host:${connectioninstance.connection.host}`);
    }
    catch(error){
        console.log("MongoDB connection error",error);
        throw error;
    }
}
export default connectDB