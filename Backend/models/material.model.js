import mongoose, { Schema } from "mongoose";

const materialSchema = new Schema({
  fileId : {
    type:String,
    required: true
  },
  fileName :{
    type:String,
    required: true
  }

},{ timestamps: true });

export default mongoose.model('Material', materialSchema);