import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { database } from "../database"
import { hashPassword, verifyPassword } from "../services/hash.service"
import {User} from "../models/user.model";

const createToken = (userId: number) => {
    const JWT_SECRET = process.env.JWT_SECRET

    if (!JWT_SECRET) {
        throw new Error("jwt secret not found")
    }

    return jwt.sign({ userId }, JWT_SECRET)
}

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body

    const exists = database.prepare(
        "SELECT id FROM users WHERE email = ?"
    ).get(email)

    if (exists) return res.status(409).json({ error: "User exists" })

    const hash = await hashPassword(password)

    const result = database.prepare(
        "INSERT INTO users (email, password_hash) VALUES (?, ?)"
    ).run(email, hash)

    res.json({ token: createToken(Number(result.lastInsertRowid)) })
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    const user = database
        .prepare("SELECT * FROM users WHERE email = ?")
        .get(email) as User | undefined

    if (!user) return res.status(401).json({ error: "Invalid credentials" })

    const ok = await verifyPassword(password, user.password_hash)
    if (!ok) return res.status(401).json({ error: "Invalid credentials" })

    console.log('working')
    res.json({ token: createToken(user.id) })
}
