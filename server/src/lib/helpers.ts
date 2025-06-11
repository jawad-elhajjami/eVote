import crypto from "crypto";

// Helper function to verify RSA signature
export const verifySignature = (
  data: string,
  signature: string,
  publicKey: string
): boolean => {
  try {
    const verifier = crypto.createVerify("SHA256");
    verifier.update(data);
    verifier.end();

    return verifier.verify(publicKey, signature, "base64");
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
};

// Helper function to generate receipt
export const generateReceipt = (voteData: any): string => {
  const receiptData = {
    pollId: voteData.pollId,
    userId: voteData.userId,
    option: voteData.option,
    timestamp: voteData.timestamp,
    hash: voteData.hash,
    nonce: crypto.randomBytes(16).toString("hex"),
  };

  return crypto
    .createHash("sha256")
    .update(JSON.stringify(receiptData))
    .digest("hex");
};


