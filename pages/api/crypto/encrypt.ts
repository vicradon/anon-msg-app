const crypto = require("crypto");

// Encrypt some data using the secret key and an initialization vector
export default function encrypt(req, res) {
  const msg = req.body.msg;

  // Generate a random initialization vector (IV)
  const iv = crypto.randomBytes(16);

  // Create the cipher using the secret key and the IV
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.CRYPTO_SECRET_KEY, "hex"),
    iv
  );

  // Encrypt the message
  let encrypted = cipher.update(msg, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Return the IV and the encrypted message
  res.status(200).json({ iv: iv.toString("hex"), msg: encrypted });
}
