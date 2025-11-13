import { Router } from "express";
import { verifyJWT, verifyJWToptional } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteNotespaid, getAllNotespaid, getMyNotesPaid, getNotesPaidForBuyers, publishANotespaid, updateNotesPaidDetails, updateNotespaidImage } from "../controllers/notesPaid.controller.js";
const router = Router();

//sell routes
router.post("/list-notesPaid", verifyJWT, upload.single("image"), publishANotespaid);
router.get("/getAll-notesPaid", verifyJWT, getAllNotespaid);
router.post("/update-image", verifyJWT, upload.single("image") ,updateNotespaidImage)
router.patch("/update-notesPaidDetails", verifyJWT, updateNotesPaidDetails);
router.delete("/delete-notesPaid/:notesId", verifyJWT, deleteNotespaid)
router.get("/my-notesPaid", verifyJWT, getMyNotesPaid)

//buy routes
router.get("/buyer-notesPaid", verifyJWToptional, getNotesPaidForBuyers)

export default router;