import { Request, Response } from "express"
import {encryptText, decryptText, encryptFileBuffer, decryptFileBuffer} from "../services/crypto.service"
import { database } from "../database"
import {AuthRequest} from "../middleware/auth.middleware";

export const encryptTextHandler = (req: AuthRequest, res: Response) => {
    const { text, passphrase } = req.body
    const userId = req.userId!

    if (!text || !passphrase)
        return res.status(400).json({
            code: "MISSING_DATA",
            error: "Missing data"
        })

    const encrypted = encryptText(text, passphrase)

    database.prepare(`
        INSERT INTO encrypted_texts
            (user_id, plain_text, encrypted_text, algorithm)
        VALUES (?, ?, ?, ?)
    `).run(userId, text, encrypted, "AES")

    res.json({ encrypted })
}

export const decryptTextHandler = (req: Request, res: Response) => {
    const { encrypted, passphrase } = req.body

    try {
        const decrypted = decryptText(encrypted, passphrase)
        res.json({ decrypted })
    } catch {
        res.status(400).json({
            code: "WRONG_PASSWORD_OR_CORRUPTED_DATA",
            error: "Wrong password or corrupted data"
        })
    }
}

export const encryptFileHandler = (
    req: AuthRequest,
    res: Response
) => {
    const file = req.file
    const { password } = req.body

    if (!file || !password) {
        return res.status(400).json({
            code: "MISSING_DATA",
            error: "Missing data"
        })
    }

    try {
        const encryptedBuffer = encryptFileBuffer(
            file.buffer,
            password
        )

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${file.originalname}.enc"`
        )

        res.setHeader(
            "Content-Type",
            "application/octet-stream"
        )

        return res.send(encryptedBuffer)

    } catch {
        return res.status(500).json({
            error: "Encryption failed"
        })
    }
}

export const decryptFileHandler = (
    req: AuthRequest,
    res: Response
) => {
    const file = req.file
    const { password } = req.body

    if (!file || !password) {
        return res.status(400).json({
            code: "MISSING_DATA",
            error: "Missing data"
        })
    }

    try {
        const decryptedBuffer = decryptFileBuffer(
            file.buffer,
            password
        )

        const originalName = file.originalname.replace(
            /\.enc$/,
            ""
        )

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${originalName}"`
        )

        res.setHeader(
            "Content-Type",
            "application/octet-stream"
        )

        return res.send(decryptedBuffer)

    } catch {
        res.status(400).json({
            code: "WRONG_PASSWORD_OR_CORRUPTED_DATA",
            error: "Wrong password or corrupted data"
        })
    }
}

export const getHistoryHandler = (req: AuthRequest, res: Response) => {
    const userId = req.userId!

    const rows = database.prepare(`
    SELECT
      id,
      encrypted_text,
      algorithm,
      created_at
    FROM encrypted_texts
    WHERE user_id = ?
    ORDER BY created_at DESC
  `).all(userId)

    res.json(rows)
}
