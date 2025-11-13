import { Router } from "express";
import { verifyJWT , verifyJWToptional} from "../middlewares/auth.middleware.js";
import { deleteBook, getAllBooks, publishABook, updateBookDetails, updateBookImage, getBooksForBuyers, getMyBooks } from "../controllers/books.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

//seller routes
router.post("/list-book", verifyJWT, upload.single("image"), publishABook);
router.get("/getAll-books", verifyJWT, getAllBooks); 
router.post("/update-image", verifyJWT, upload.single("image"), updateBookImage);
router.patch("/update-bookDetails", verifyJWT, updateBookDetails);
router.delete("/delete-book/:bookId", verifyJWT, deleteBook);
router.get("/my-books", verifyJWT, getMyBooks)

//buyer routes
router.get("/buyer-books", verifyJWToptional, getBooksForBuyers);

export default router;