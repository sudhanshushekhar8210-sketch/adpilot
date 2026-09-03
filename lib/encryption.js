import crypto from "crypto";

const ENCRYPTION_KEY = process.env.META_TOKEN_ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  throw new Error(
    "META_TOKEN_ENCRYPTION_KEY is not defined in environment variables"
  );
}

const KEY = Buffer.from(ENCRYPTION_KEY, "hex");

if (KEY.length !== 32) {
  throw new Error(
    "META_TOKEN_ENCRYPTION_KEY must be exactly 32 bytes / 64 hex characters"
  );
}

export function encryptToken(text) {
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    KEY,
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
}

export function decryptToken(encryptedText) {
  const [ivHex, authTagHex, encryptedHex] =
    encryptedText.split(":");

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    KEY,
    Buffer.from(ivHex, "hex")
  );

  decipher.setAuthTag(
    Buffer.from(authTagHex, "hex")
  );

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}