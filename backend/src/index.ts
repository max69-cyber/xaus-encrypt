import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes"
import cryptoRoutes from "./routes/crypto.routes";
import "./database"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/auth", authRoutes)

app.use("/crypto", cryptoRoutes)

app.listen(3000, () => console.log("Backend running"))
