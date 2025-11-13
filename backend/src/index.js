import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import http from "http";

dotenv.config({ path: "./.env" });

const server = http.createServer(app);

// If you don't need socket.io at all, you can remove this import and instance creation
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// You can remove the io.on("connection") block entirely

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 3000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error);
  });
