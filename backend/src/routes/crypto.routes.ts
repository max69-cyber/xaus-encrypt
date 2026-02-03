import { Router } from "express"
import { encryptTextHandler, decryptTextHandler } from "../controllers/crypto.controller"
import {authMiddleware} from "../middleware/auth.middleware";

const cryptoRouter = Router()

cryptoRouter.post("/encrypt-text", authMiddleware, encryptTextHandler)
cryptoRouter.post("/decrypt-text", authMiddleware, decryptTextHandler)

export default cryptoRouter
