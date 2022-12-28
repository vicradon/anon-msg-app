export const encryptMsg = async (message) => {
  const key = await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    new TextEncoder().encode(message)
  );

  return {
    encrypted,
    key,
    iv,
  };
};

export const decryptMsg = async ({ encrypted, key, iv }) => {
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encrypted
  );

  return new TextDecoder().decode(decrypted);
};

export const exportKey = async (key) => {
  const exportedKey = await window.crypto.subtle.exportKey("jwk", key);
  return exportedKey;
};
