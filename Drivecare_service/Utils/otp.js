const crypto = require("crypto");

const ALGO = "aes-256-gcm";
const OTP_TTL_MIN = 15;
const MAX_ATTEMPTS = 5;

if (!process.env.OTP_ENCRYPTION_KEY) {
  throw new Error("OTP_ENCRYPTION_KEY missing");
}
const KEY = Buffer.from(process.env.OTP_ENCRYPTION_KEY, "hex");
if (KEY.length !== 32) {
  throw new Error("OTP_ENCRYPTION_KEY must be 32 bytes (64 hex chars)");
}

function generateOtp() {
  return String(crypto.randomInt(100000, 999999));
}

function encryptOtp(plain) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return {
    ciphertext: enc.toString("base64"),
    iv: iv.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64"),
  };
}

function decryptOtp({ ciphertext, iv, authTag }) {
  const decipher = crypto.createDecipheriv(
    ALGO,
    KEY,
    Buffer.from(iv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(authTag, "base64"));
  const dec = Buffer.concat([
    decipher.update(Buffer.from(ciphertext, "base64")),
    decipher.final(),
  ]);
  return dec.toString("utf8");
}

function safeEqual(a, b) {
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  if (A.length !== B.length) return false;
  return crypto.timingSafeEqual(A, B);
}

function buildOtpDoc(plain) {
  return {
    ...encryptOtp(plain),
    expiresAt: new Date(Date.now() + OTP_TTL_MIN * 60 * 1000),
    attempts: 0,
    maxAttempts: MAX_ATTEMPTS,
    createdAt: new Date(),
  };
}

module.exports = {
  generateOtp,
  encryptOtp,
  decryptOtp,
  safeEqual,
  buildOtpDoc,
  OTP_TTL_MIN,
  MAX_ATTEMPTS,
};
