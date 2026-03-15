import crypto from "node:crypto";

const DEFAULT_ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;
const CHACHA_NONCE_LENGTH = 12;
const CHACHA_TAG_LENGTH = 16;

function getKeyFromPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest();
}

export function encryptText(
  text: string,
  password: string,
  algorithm: string = DEFAULT_ALGORITHM,
): string {
  if (algorithm === "chacha20-poly1305") {
    const nonce = crypto.randomBytes(CHACHA_NONCE_LENGTH);
    const key = getKeyFromPassword(password);

    const cipher = crypto.createCipheriv("chacha20-poly1305", key, nonce, {
      authTagLength: CHACHA_TAG_LENGTH,
    });

    const encrypted = Buffer.concat([
      cipher.update(text, "utf8"),
      cipher.final(),
    ]);

    const tag = cipher.getAuthTag();

    return [
      nonce.toString("base64"),
      tag.toString("base64"),
      encrypted.toString("base64"),
    ].join(":");
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getKeyFromPassword(password);

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");

  return iv.toString("base64") + ":" + encrypted;
}

export function decryptText(
  data: string,
  password: string,
  algorithm: string = DEFAULT_ALGORITHM,
): string {
  if (algorithm === "chacha20-poly1305") {
    const [nonceBase64, tagBase64, encryptedBase64] = data.split(":");

    const nonce = Buffer.from(nonceBase64, "base64");
    const tag = Buffer.from(tagBase64, "base64");
    const encrypted = Buffer.from(encryptedBase64, "base64");

    const key = getKeyFromPassword(password);

    const decipher = crypto.createDecipheriv("chacha20-poly1305", key, nonce, {
      authTagLength: CHACHA_TAG_LENGTH,
    });

    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  }

  const [ivBase64, encrypted] = data.split(":");

  const iv = Buffer.from(ivBase64, "base64");
  const key = getKeyFromPassword(password);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encrypted, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

export function encryptFileBuffer(buffer: Buffer, password: string): Buffer {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getKeyFromPassword(password);

  const cipher = crypto.createCipheriv(DEFAULT_ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

  return Buffer.concat([iv, encrypted]);
}

export function decryptFileBuffer(buffer: Buffer, password: string): Buffer {
  const iv = buffer.subarray(0, IV_LENGTH);
  const encryptedData = buffer.subarray(IV_LENGTH);

  const key = getKeyFromPassword(password);

  const decipher = crypto.createDecipheriv(DEFAULT_ALGORITHM, key, iv);

  return Buffer.concat([decipher.update(encryptedData), decipher.final()]);
}
