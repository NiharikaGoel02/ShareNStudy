import {app} from "./app.js"
import connectDB from "./db/index.js"
import dotenv from "dotenv"
import { Server } from "socket.io";
import http from "http";
import { Chat } from "./models/chat.models.js"
import { timeStamp } from "console";

dotenv.config({
    path : './.env'
})

const server = http.createServer(app);

const io = new Server(server, {
    cors : {
        origin : "http://localhost:5173",
        methods : ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);

    socket.on("joinRoom", ({ roomId }) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    socket.on("sendMessage", async ({ roomId, senderId, text, buyerId, sellerId }) => {
        const message = { sender: senderId, text, timeStamp: new Date() };

        //save in MongoDB
        let chat = await Chat.findOne({ buyer: buyerId, seller: sellerId});
        if(!chat){
            chat = new Chat({ buyer: buyerId, seller: sellerId, messages: [] });
        }
        chat.messages.push(message);
        await chat.save();

        io.to(roomId).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

connectDB()
.then(() => {
    server.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`)
    })
})
.catch((error) => {
    console.log("MongoDB connection failed |||", error)
})