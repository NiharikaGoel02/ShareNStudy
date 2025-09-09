import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema({
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
    link : {
        type : String,  
        required : true
    },
    image : {
        type : String,
        required : true
    }
}, {timestamps : true})

export const Playlist = mongoose.model("Playlist", playlistSchema)