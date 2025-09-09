import { Router } from "express";
import { Chat } from "../models/chat.models.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// Get all chats for a user (buyer or seller)
router.get("/my-chats", verifyJWT, asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const chats = await Chat.find({
        $or: [{ buyer: userId }, { seller: userId }]
    })
    .populate("buyer", "fullName email")
    .populate("seller", "fullName email")
    .sort({ updatedAt: -1 }); // recent chats first

    return res.status(200).json({
        status: "success",
        data: chats
    });
}));

// Get chat between buyer & seller
router.get("/:buyerId/:sellerId", verifyJWT, async (req, res) => {
    const { buyerId, sellerId } = req.params;
    const chat = await Chat.findOne({ buyer: buyerId, seller: sellerId });

    if(!chat){
        return res.status(200).json({ messages: [] });
    }
    return res.status(200).json(chat);
    //res.json(chat || { messages: [] });
});



export default router;
