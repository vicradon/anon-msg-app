const crypto = require("crypto");

// Encrypt some data using the secret key
export default function decrypt(req, res) {
  const msgs = req.body.msgs;

  const decipher = crypto.createDecipher(
    "aes-256-cbc",
    process.env.CRYPTO_SECRET_KEY
  );

  const deciphedMsgs = msgs.map((msg) => {
    if (!msg.message) return msg;

    let decrypted = decipher.update(msg.message, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return { ...msg, message: decrypted };
  });

  res.status(200).json({ messages: deciphedMsgs });
}
