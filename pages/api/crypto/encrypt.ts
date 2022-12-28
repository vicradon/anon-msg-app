const crypto = require("crypto");

// Encrypt some data using the secret key
export default function encrypt(req, res) {
  const msg = req.body.msg;
  const cipher = crypto.createCipher(
    "aes-256-cbc",
    process.env.CRYPTO_SECRET_KEY
  );
  let encrypted = cipher.update(msg, "utf8", "hex");
  encrypted += cipher.final("hex");
  res.status(200).json({ msg: encrypted });
}
