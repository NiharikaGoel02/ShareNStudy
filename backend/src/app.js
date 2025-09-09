import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({ extended : true, limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from './routes/user.routes.js'
import booksRouter from './routes/books.routes.js'
import notesPaidRouter from './routes/notesPaid.routes.js'
import notesFreeRouter from './routes/notesFree.routes.js'
import playlistRoutes from './routes/playlist.routes.js'
import chatRoutes from './routes/chat.routes.js'
import ngoRoutes from './routes/ngo.routes.js'

app.use("/api/v1/users", userRouter)
app.use("/api/v1/books", booksRouter)
app.use("/api/v1/notesPaid", notesPaidRouter)
app.use("/api/v1/notesFree", notesFreeRouter)
app.use("/api/v1/playlist", playlistRoutes)
app.use("/api/v1/chat", chatRoutes)
app.use("/api/v1/ngos", ngoRoutes)

export {app};