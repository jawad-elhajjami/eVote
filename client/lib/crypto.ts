export async function generateRSAKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  return keyPair;
}

export async function exportKeyToPEM(
  key: CryptoKey,
  type: "public" | "private"
): Promise<string> {
  const format = type === "public" ? "spki" : "pkcs8";
  const buffer = await window.crypto.subtle.exportKey(format, key);
  const label = type === "public" ? "PUBLIC KEY" : "PRIVATE KEY";
  return convertToPEM(buffer, label);
}

function convertToPEM(buffer: ArrayBuffer, label: string): string {
  const base64 = window.btoa(String.fromCharCode(...new Uint8Array(buffer)));
  const formatted = base64.match(/.{1,64}/g)?.join("\n") ?? "";
  return `-----BEGIN ${label}-----\n${formatted}\n-----END ${label}-----`;
}
