import { User } from "../models/user.models.js";
import { Playlist } from "../models/playlist.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const publishAPlaylist =  asyncHandler(async(req, res) => {
    const {subjectName, classOrSemester, link} = req.body

    if(
        [subjectName, classOrSemester, link].some((field) => 
        field?.trim() === "")
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

    const playlist = await Playlist.create({
        subjectName,
        classOrSemester,
        link,
        image : image.url,
        sellerName : currentUser._id,
        collegeName : currentUser._id
    })

    return res
    .status(201)
    .json(new ApiResponse(200, playlist, "Playlist listed successfully"))

})

const getAllPlaylists = asyncHandler(async(req, res) =>{
    const playlists = await Playlist.find().populate("sellerName", "fullName email")
    .populate("collegeName", "collegeName")
    .sort({createdAt : -1});

    return res
    .status(200)
    .json(new ApiResponse(200, playlists, "Playlist fetched successfully"))
})

const updatePlaylistImage = asyncHandler(async(req, res) => {
    const {playlistId} = req.body;
    const imageLocalPath = req.file?.path

    if(!playlistId){
        throw new ApiError(400, "PlayList ID is required");
    }

    if(!imageLocalPath){
        throw new ApiError(400, "Image file is missing")
    }

    const image = await uploadOnCloudinary(imageLocalPath)

    if(!image.url){
        throw new ApiError(500, "Error while uploading image")
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set : {
                image : image.url
            }
        },
        {new : true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "image updated successfully"))
})

const updatePlaylistDetails = asyncHandler(async(req, res) => {
    const {playlistId, subjectName, classOrSemester, link} = req.body

    if(!playlistId || !subjectName || !classOrSemester || !link){
        throw new ApiError(400, "All fields are required")
    }

    const playlistDetails = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set : {
                subjectName : subjectName,
                classOrSemester : classOrSemester,
                link : link
            }
        },
        {new : true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200, playlistDetails, "Details updated successfully"))
})

const deletePlaylist = asyncHandler(async(req, res) => {
    const {playlistId} = req.params;

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }
    await playlist.deleteOne();

    return res
    .status(200)
    .json(new ApiResponse(200, null, "Plylist deleted successfully"))
})

const getPlayListForBuyers = asyncHandler(async (req, res) => {
    let query = {};

    if(req.user){
        query.sellerName = { $ne : req.user._id};
    }

    const playlist = await Playlist.find(query)
    .populate("sellerName", "fullName email collegeName")
    .sort({ createdAt : -1});

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully for buyers"));
})

const getMyPlaylists = asyncHandler(async (req, res) => {
  const playlists = await Playlist.find({ sellerName: req.user._id })
    .populate("sellerName", "fullName email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, playlists, "Your playlists fetched successfully"));
});


export{
    publishAPlaylist,
    getAllPlaylists,
    updatePlaylistImage,
    updatePlaylistDetails,
    deletePlaylist,
    getPlayListForBuyers,
    getMyPlaylists
}