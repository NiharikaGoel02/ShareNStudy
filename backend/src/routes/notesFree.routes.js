import { Router } from "express";
import { verifyJWT, verifyJWToptional } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteNotesfree, getAllNotesFree, getMyNotesFree, getNotesFreeForBuyers, publishANotesFree, updateNotesFreeDetails, updateNotesFreePdf } from "../controllers/notesFree.controllers.js";

const router = Router();

//sell routes
router.post("/list-notesFree", verifyJWT, upload.single("pdf"), publishANotesFree);
router.get("/getAll-notesFree", verifyJWT, getAllNotesFree);
router.post("/update-image", verifyJWT, upload.single("pdf") ,updateNotesFreePdf);
router.patch("/update-notesFreeDetails", verifyJWT, updateNotesFreeDetails);
router.delete("/delete-notesFree/:notesId", verifyJWT, deleteNotesfree)
router.get("/my-notesFree", verifyJWT, getMyNotesFree)

//buy routes
router.get("/buyer-notesFree", verifyJWToptional, getNotesFreeForBuyers);

export default router;