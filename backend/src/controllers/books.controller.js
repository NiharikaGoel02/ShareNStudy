import { User } from "../models/user.models.js";
import { Books } from "../models/books.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const publishABook =  asyncHandler(async(req, res) => {
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

    const book = await Books.create({
        subjectName,
        classOrSemester,
        price,
        image : image.url,
        sellerName : currentUser._id,
        collegeName : currentUser._id
    })

    return res
    .status(201)
    .json(new ApiResponse(200, book, "Book listed successfully"))

})

const getAllBooks = asyncHandler(async(req, res) =>{
    const books = await Books.find().populate("sellerName", "fullName email")
    .populate("collegeName", "collegeName")
    .sort({createdAt : -1});

    return res
    .status(200)
    .json(new ApiResponse(200, books, "Books fetched successfully"))
})

const updateBookImage = asyncHandler(async(req, res) => {
    const { bookId } = req.body;
    const imageLocalPath = req.file?.path;

    if(!bookId){
        throw new ApiError(400, "Book ID is required");
    }

    if(!imageLocalPath){
        throw new ApiError(400, "Image file is missing")
    }

    const image = await uploadOnCloudinary(imageLocalPath)

    if(!image.url){
        throw new ApiError(500, "Error while uploading image")
    }

    const book = await Books.findByIdAndUpdate(
        bookId,
        {
            $set : {
                image : image.url
            }
        },
        {new : true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200, book, "image updated successfully"))
})

const updateBookDetails = asyncHandler(async(req, res) => {
    const {bookId, subjectName, classOrSemester, price} = req.body

    if(!bookId || !subjectName || !classOrSemester || !price){
        throw new ApiError(400, "All fields are required")
    }

    const bookDetails = await Books.findByIdAndUpdate(
        bookId,
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
    .json(new ApiResponse(200, bookDetails, "Details updated successfully"))
})

const deleteBook = asyncHandler(async(req, res) => {
    const {bookId} = req.params;

    const book = await Books.findById(bookId)

    if(!book){
        throw new ApiError(404, "Book not found")
    }
    await book.deleteOne();

    return res
    .status(200)
    .json(new ApiResponse(200, null, "Book deleted successfully"))
})

const getBooksForBuyers = asyncHandler(async (req, res) => {
    let query = {};

    if(req.user){
        query.sellerName = { $ne : req.user._id};
    }

    const books = await Books.find(query)
    .populate("sellerName", "fullName email collegeName")
    .sort({ createdAt : -1});

    console.log("Books fetched from MongoDB:", books);
    console.log("User in request:", req.user);


    return res
    .status(200)
    .json(new ApiResponse(200, books, "Books fetched successfully for buyers"));
})

const getMyBooks = asyncHandler(async (req, res) => {
  const books = await Books.find({ sellerName: new mongoose.Types.ObjectId(req.user._id) })
    .populate("sellerName", "fullName email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, books, "Your books fetched successfully"));
});



export{
    publishABook,
    getAllBooks,
    updateBookDetails,
    updateBookImage,
    deleteBook,
    getBooksForBuyers,
    getMyBooks
}