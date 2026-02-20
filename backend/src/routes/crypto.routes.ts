import { Router } from "express"
import {
    encryptTextHandler,
    decryptTextHandler,
    getHistoryHandler,
    encryptFileHandler, decryptFileHandler
} from "../controllers/crypto.controller"
import {authMiddleware} from "../middleware/auth.middleware";

const cryptoRouter = Router()

cryptoRouter.get('/history', authMiddleware, getHistoryHandler)

cryptoRouter.post("/encrypt-text", authMiddleware, encryptTextHandler)
cryptoRouter.post("/decrypt-text", authMiddleware, decryptTextHandler)

cryptoRouter.post("/encrypt-file", authMiddleware, encryptFileHandler)
cryptoRouter.post("/decrypt-file", authMiddleware, decryptFileHandler)

export default cryptoRouter
