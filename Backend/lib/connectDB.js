import mongoose from "mongoose";
const connectDB = async ()=>{
    try{
       await mongoose.connect(process.env.MONGO_DB_URI);
       //console.log("MongoDB is connected successfully")
    }
    catch(err){
        //console.log("Error while setting up the DB\n",err);
    }
}

export default connectDB