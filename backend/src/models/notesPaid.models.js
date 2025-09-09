import mongoose, { Schema } from "mongoose";

const notespaidSchema = new Schema({
    subjectName : {
        type : String,
        required : true,
        trim : true
    },
    classOrSemester : {
        type : String,
        required : true
    },
    sellerName : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    collegeName : {
        type : Schema.Types.ObjectId,
        ref : "User" 
    },
    price : {
        type : Number,
        required : true
    },
    image : {
        type : String,  //cloudinary url
        required : true
    }
}, {timestamps : true})

export const NotesPaid = mongoose.model("NotesPaid", notespaidSchema)