import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import {Books} from "../models/books.models.js";
import { Notesfree } from "../models/notesFree.models.js"
import { NotesPaid } from "../models/notesPaid.models.js"
import { Playlist } from "../models/playlist.models.js"

const generateAccessAndRefreshToken = async(userId) => {
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        return {accessToken, refreshToken}

    } catch(error){
        throw new ApiError(500, "Something went wrong while generating refresh token")
    }
}

const registerUser = asyncHandler(async(req, res) => {
    //get user details from frontend
    //validation - not empty
    //check if the user already exists : email
    //create user object(entry in db)
    //remove password and refreshToken field from response
    //check for user creation
    //return res

    const {fullName, collegeName, email, password} = req.body
    console.log("req.body is:", req.body);


    if(!fullName){
        throw new ApiError(400, "hello")
    }

    if(
        [fullName, collegeName, email, password].some((field) => 
        field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }
    const existedUser = await User.findOne({
        $or : [{email}]
    })

    if(existedUser){
        throw new ApiError(409, "User with email and username already exists")
    }
    console.log(req.files);

    const user = await User.create({
        fullName,
        collegeName,
        email,
        password
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered Successfully"))
})

const loginUser = asyncHandler(async(req, res) => {
    //req body data from user
    //check email
    //find the user
    //password check
    //access token and refresh token
    //send cookie

    const {email, password} = req.body
    if(!email){
        throw new ApiError(400, "email is required")
    }

    const user = await User.findOne({
        $or : [{email}]
    })

    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, {
            user : loggedUser, accessToken, refreshToken
        },
        "User logged in successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id, {
            $unset : {
                refreshToken : 1  // this removes the field from document
            }
        },
        {
            new : true
        }
    )
    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"))
})

const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request")
    }

    try{
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if(!user){
            throw new ApiError(401, "Invalid refresh Token")
        }

        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options = {
            httpOnly : true,
            secure : true
        }

        const {accessToken, newrefreshToken} = await generateAccessAndRefreshToken(user._id)

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newrefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken : newrefreshToken},
                "Access Token refresh"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh Token")
    }
})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid old password")
    }
    user.password = newPassword
    await user.save({validateBeforeSave : false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"))
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, collegeName} = req.body

    if(!fullName || !collegeName){
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                fullName : fullName,
                collegeName : collegeName
            }
        },
        {new : true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
})

const getMyListingsCount = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const [booksCount, notesFreeCount, notesPaidCount, playlistCount] = await Promise.all([
        Books.countDocuments({ sellerName: userId}),
        NotesPaid.countDocuments({ sellerName: userId}),
        Notesfree.countDocuments({ sellerName: userId}),
        Playlist.countDocuments({ sellerName: userId}),
    ]);

    const total = booksCount + notesPaidCount + notesFreeCount + playlistCount;

    return res
    .status(200)
    .json({
        status : "success",
        data: {
            booksCount,
            notesPaidCount,
            notesFreeCount,
            playlistCount,
            total
        },
        message: "User listings count fetched successfully"
    });
})

export {
    generateAccessAndRefreshToken,
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    getMyListingsCount
}