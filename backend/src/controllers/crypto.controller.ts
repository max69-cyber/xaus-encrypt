import { Request, Response } from "express"
import { encryptText, decryptText } from "../services/crypto.service"
import { database } from "../database"
import {AuthRequest} from "../middleware/auth.middleware";

export const encryptTextHandler = (req: AuthRequest, res: Response) => {
    const { text, password } = req.body
    const userId = req.userId!

    if (!text || !password)
        return res.status(400).json({ error: "Missing data" })

    const encrypted = encryptText(text, password)

    database.prepare(`
        INSERT INTO encrypted_texts
            (user_id, plain_text, encrypted_text, algorithm)
        VALUES (?, ?, ?, ?)
    `).run(userId, text, encrypted, "AES")

    res.json({ encrypted })
}

export const decryptTextHandler = (req: Request, res: Response) => {
    const { encrypted, password } = req.body

    try {
        const decrypted = decryptText(encrypted, password)
        res.json({ decrypted })
    } catch {
        res.status(400).json({ error: "Wrong password or corrupted data" })
    }
}
