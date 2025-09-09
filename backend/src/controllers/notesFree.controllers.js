import { User } from "../models/user.models.js";
import { Notesfree } from "../models/notesFree.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const publishANotesFree =  asyncHandler(async(req, res) => {
    const {subjectName, classOrSemester} = req.body

    if(
        [subjectName, classOrSemester].some((field) => 
        field?.trim() === "")
    ){
        throw new ApiError(400, "All Fields are required")
    }
    console.log(req.files);

    const pdfLocalPath = req.file?.path

    if(!pdfLocalPath){
        throw new ApiError(400, "document is required")
    }

    const pdf = await uploadOnCloudinary(pdfLocalPath)
    console.log("Uploading to Cloudinary from path:", pdfLocalPath);

    if(!pdf){
        throw new ApiError(500, "Document upload required")
    }

    const currentUser = await User.findById(req.user._id);
    if(!currentUser){
        throw new ApiError(500, "Document upload failed")
    }

    const notesFree = await Notesfree.create({
        subjectName,
        classOrSemester,
        pdf : pdf.secure_url,
        sellerName : currentUser._id,
        collegeName : currentUser._id
    })

    return res
    .status(201)
    .json(new ApiResponse(200, notesFree, "Document listed successfully"))

})

const getAllNotesFree = asyncHandler(async(req, res) =>{
    const notesFree = await Notesfree.find().populate("sellerName", "fullName email")
    .populate("collegeName", "collegeName")
    .sort({createdAt : -1});

    return res
    .status(200)
    .json(new ApiResponse(200, notesFree, "Documents fetched successfully"))
})

const updateNotesFreePdf = asyncHandler(async(req, res) => {
    const {notesId} = req.body;
    const pdfLocalPath = req.file?.path

    if(!notesId){
        throw new ApiError(400, "Notes ID is required");
    }

    if(!pdfLocalPath){
        throw new ApiError(400, "Document file is missing")
    }

    const pdf = await uploadOnCloudinary(pdfLocalPath)

    if(!pdf.url){
        throw new ApiError(500, "Error while uploading document")
    }

    const notesFree = await Notesfree.findByIdAndUpdate(
        notesId,
        {
            $set : {
                pdf : pdf.url
            }
        },
        {new : true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200, notesFree, "image updated successfully"))
})

const updateNotesFreeDetails = asyncHandler(async(req, res) => {
    const {notesId, subjectName, classOrSemester} = req.body

    if(!notesId || !subjectName || !classOrSemester){
        throw new ApiError(400, "All fields are required")
    }

    const notesDetail = await Notesfree.findByIdAndUpdate(
        notesId,
        {
            $set : {
                subjectName : subjectName,
                classOrSemester : classOrSemester
            }
        },
        {new : true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200, notesDetail, "Details updated successfully"))
})

const deleteNotesfree = asyncHandler(async(req, res) => {
    const {notesId} = req.params;

    const notesFree = await Notesfree.findById(notesId)

    if(!notesFree){
        throw new ApiError(404, "Document not found")
    }
    await notesFree.deleteOne();

    return res
    .status(200)
    .json(new ApiResponse(200, null, "Document deleted successfully"))
})

const getNotesFreeForBuyers = asyncHandler(async (req, res) => {
    let query = {};

    if(req.user){
        query.sellerName = { $ne : req.user._id};
    }

    const notesFree = await Notesfree.find(query)
    .populate("sellerName", "fullName email collegeName")
    .sort({ createdAt : -1});

    return res
    .status(200)
    .json(new ApiResponse(200, notesFree, "Notes free fetched successfully for buyers"));
})


export{
    publishANotesFree,
    getAllNotesFree,
    updateNotesFreePdf,
    updateNotesFreeDetails,
    deleteNotesfree, 
    getNotesFreeForBuyers
}