import { Router } from "express"
import {
    encryptTextHandler,
    decryptTextHandler,
    getHistoryHandler,
    encryptFileHandler, decryptFileHandler
} from "../controllers/crypto.controller"
import {authMiddleware} from "../middleware/auth.middleware";
import multer from "multer";

const cryptoRouter = Router()

// using ram
const upload = multer({
    storage: multer.memoryStorage(),
})

cryptoRouter.get('/history', authMiddleware, getHistoryHandler)

cryptoRouter.post("/encrypt-text", authMiddleware, encryptTextHandler)
cryptoRouter.post("/decrypt-text", authMiddleware, decryptTextHandler)

cryptoRouter.post("/encrypt-file", authMiddleware, upload.single("file"), encryptFileHandler)
cryptoRouter.post("/decrypt-file", authMiddleware, upload.single("file"), decryptFileHandler)

export default cryptoRouter
