import crypto from "node:crypto"

const ALGORITHM = "aes-256-cbc"
const IV_LENGTH = 16

function getKeyFromPassword(password: string) {
    return crypto.createHash("sha256").update(password).digest()
}

export function encryptText(text: string, password: string): string {
    const iv = crypto.randomBytes(IV_LENGTH)
    const key = getKeyFromPassword(password)

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

    let encrypted = cipher.update(text, "utf8", "base64")
    encrypted += cipher.final("base64")

    return iv.toString("base64") + ":" + encrypted
}

export function decryptText(data: string, password: string): string {
    const [ivBase64, encrypted] = data.split(":")

    const iv = Buffer.from(ivBase64, "base64")
    const key = getKeyFromPassword(password)

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)

    let decrypted = decipher.update(encrypted, "base64", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
}


export function encryptFileBuffer(
    buffer: Buffer,
    password: string
): Buffer {
    const iv = crypto.randomBytes(IV_LENGTH)
    const key = getKeyFromPassword(password)

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

    const encrypted = Buffer.concat([
        cipher.update(buffer),
        cipher.final()
    ])

    return Buffer.concat([iv, encrypted])
}

export function decryptFileBuffer(
    buffer: Buffer,
    password: string
): Buffer {
    const iv = buffer.subarray(0, IV_LENGTH)
    const encryptedData = buffer.subarray(IV_LENGTH)

    const key = getKeyFromPassword(password)

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)

    return Buffer.concat([
        decipher.update(encryptedData),
        decipher.final()
    ])
}
