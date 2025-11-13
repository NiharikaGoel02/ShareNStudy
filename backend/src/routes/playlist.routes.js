import { Router } from "express";
import { verifyJWT, verifyJWToptional } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { deletePlaylist, getAllPlaylists, getMyPlaylists, getPlayListForBuyers, publishAPlaylist, updatePlaylistDetails, updatePlaylistImage } from "../controllers/playlist.controllers.js";

const router = Router();

//sell routes
router.post("/list-playlist", verifyJWT, upload.single("image"), publishAPlaylist);
router.get("/getAll-playlists", verifyJWT, getAllPlaylists);
router.post("/update-image", verifyJWT, upload.single("image") ,updatePlaylistImage);
router.patch("/update-playlistDetails", verifyJWT, updatePlaylistDetails);
router.delete("/delete-playlist/:playlistId", verifyJWT, deletePlaylist);
router.get("/my-playlists", verifyJWT, getMyPlaylists)

//buy routes
router.get("/buyer-playlist", verifyJWToptional, getPlayListForBuyers)

export default router;