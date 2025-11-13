import { User } from "../models/user.models.js";
import { NotesPaid } from "../models/notesPaid.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const publishANotespaid =  asyncHandler(async(req, res) => {
    const {subjectName, classOrSemester, price} = req.body

    if(
        [subjectName, classOrSemester].some((field) => typeof
        field !== "string" || field.trim() === "") || isNaN(Number(price))
    ){
        throw new ApiError(400, "All Fields are required")
    }
    console.log(req.files);

    const imageLocalPath = req.file?.path

    if(!imageLocalPath){
        throw new ApiError(400, "Image is required")
    }

    const image = await uploadOnCloudinary(imageLocalPath)
    console.log("Uploading to Cloudinary from path:", imageLocalPath);

    if(!image){
        throw new ApiError(500, "Image upload required")
    }

    const currentUser = await User.findById(req.user._id);
    if(!currentUser){
        throw new ApiError(500, "Image upload failed")
    }

    const notesPaid = await NotesPaid.create({
        subjectName,
        classOrSemester,
        price,
        image : image.url,
        sellerName : currentUser._id,
        collegeName : currentUser._id
    })

    return res
    .status(201)
    .json(new ApiResponse(200, notesPaid, "Notes listed successfully"))

})

const getAllNotespaid = asyncHandler(async(req, res) =>{
    const Notespaid = await NotesPaid.find().populate("sellerName", "fullName email")
    .populate("collegeName", "collegeName")
    .sort({createdAt : -1});

    return res
    .status(200)
    .json(new ApiResponse(200, Notespaid, "Notes fetched successfully"))
})

const updateNotespaidImage = asyncHandler(async(req, res) => {
    const {notesId} = req.body;
    const imageLocalPath = req.file?.path

    if(!notesId){
        throw new ApiError(400, "Notes ID is required")
    }

    if(!imageLocalPath){
        throw new ApiError(400, "Image file is missing")
    }

    const image = await uploadOnCloudinary(imageLocalPath)

    if(!image.url){
        throw new ApiError(500, "Error while uploading image")
    }

    const notesPaid = await NotesPaid.findByIdAndUpdate(
        notesId,
        {
            $set : {
                image : image.url
            }
        },
        {new : true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200, notesPaid, "Notes updated successfully"))
})

const updateNotesPaidDetails = asyncHandler(async(req, res) => {
    const {notesId, subjectName, classOrSemester, price} = req.body

    if(!notesId || !subjectName || !classOrSemester || !price){
        throw new ApiError(400, "All fields are required")
    }

    const notesDetails = await NotesPaid.findByIdAndUpdate(
        notesId,
        {
            $set : {
                subjectName : subjectName,
                classOrSemester : classOrSemester,
                price : price
            }
        },
        {new : true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200, notesDetails, "Details updated successfully"))
})

const deleteNotespaid = asyncHandler(async(req, res) => {
    const {notesId} = req.params;

    const notesPaid = await NotesPaid.findById(notesId)

    if(!notesPaid){
        throw new ApiError(404, "Notes not found")
    }
    await notesPaid.deleteOne();

    return res
    .status(200)
    .json(new ApiResponse(200, null, "Notes deleted successfully"))
})

const getNotesPaidForBuyers =  asyncHandler(async (req, res) => {
    let query = {};

    if(req.user){
        query.sellerName = { $ne : req.user._id};
    }

    const notesPaid = await NotesPaid.find(query)
    .populate("sellerName", "fullName email collegeName")
    .sort({createdAt : -1});

    return res
    .status(200)
    .json(new ApiResponse(200, notesPaid, "Notes paid fetched successfully for buyers"))
})

const getMyNotesPaid = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized. Please login again.");
  }

  const myNotes = await NotesPaid.find({ sellerName: userId })
    .populate("sellerName", "fullName email")
    .populate("collegeName", "collegeName")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, myNotes, "My paid notes fetched successfully"));
});



export{
    publishANotespaid,
    getAllNotespaid,
    updateNotespaidImage,
    updateNotesPaidDetails,
    deleteNotespaid, 
    getNotesPaidForBuyers,
    getMyNotesPaid
}