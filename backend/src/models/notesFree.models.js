import mongoose, { Schema } from "mongoose";

const notesfreeSchema = new Schema({
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
    pdf : {
        type : String,  //cloudinary url
        required : true
    }
}, {timestamps : true})

export const Notesfree = mongoose.model("NotesFree", notesfreeSchema)