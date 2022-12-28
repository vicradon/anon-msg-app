const crypto = require("crypto");

// Decrypt some data using the secret key and an initialization vector
export default function decrypt(req, res) {
  const msgs = req.body.msgs;

  const deciphedMsgs = msgs.map((msg) => {
    if (!msg.message || !msg.iv) return msg;

    // Create the decipher using the secret key and the IV
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(process.env.CRYPTO_SECRET_KEY, "hex"),
      Buffer.from(msg.iv, "hex")
    );

    // Decrypt the message
    let decrypted = decipher.update(msg.message, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return { ...msg, message: decrypted };
  });

  res.status(200).json({ messages: deciphedMsgs });
}
