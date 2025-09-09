import mongoose, { Schema } from "mongoose";

const booksSchema = new Schema({
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
        required : true,
        min: 0
    },
    image : {
        type : String,  //cloudinary url
        required : true
    }
}, {timestamps : true})

export const Books = mongoose.model("Books", booksSchema)