// THIS FILE IS STATIC, THEREFORE NEVER CHANGE IT

import CryptoJS from "crypto-js";

// Type definition for user parameters
export interface UserParams {
  keyspace: string;
  role: string;
  userId: string;
}

// Configuration interface
interface AESConfig {
  key: CryptoJS.lib.WordArray;
  iv: CryptoJS.lib.WordArray;
}

// Helper function to get and validate environment variables
function getAESConfig(): AESConfig {
  const chipperKey = "$2a$10$v/rBva2YoygYQPdy3uEXZ.1Ay";
  const chipperIV = "of7ppyVI0GEcrkw4";

  if (!chipperKey || !chipperIV) {
    throw new Error("Chipper key or IV not found in environment variables");
  }

  return {
    key: CryptoJS.enc.Utf8.parse(chipperKey),
    iv: CryptoJS.enc.Utf8.parse(chipperIV),
  };
}

// Helper function to validate user parameters
function validateUserParams(
  keyspace: string,
  role: string,
  userId: string,
): void {
  if (!keyspace?.trim())
    throw new Error("Keyspace is required and cannot be empty");
  if (!role?.trim()) throw new Error("Role is required and cannot be empty");
  if (!userId?.trim())
    throw new Error("UserId is required and cannot be empty");
}

// AES-256 encode params
export const encodeParamsAES256 = (
  keyspace: string,
  role: string,
  userId: string,
): string => {
  validateUserParams(keyspace, role, userId);

  try {
    const config = getAESConfig();
    const data = JSON.stringify({ keyspace, role, userId });

    const encrypted = CryptoJS.AES.encrypt(data, config.key, {
      iv: config.iv,
      mode: CryptoJS.mode.CBC,
    });

    return encrypted.toString();
  } catch (err) {
    throw new Error(
      `Encryption failed: ${
        err instanceof Error ? err.message : "Unknown error"
      }`,
    );
  }
};

// AES-256 decode params
export const decodeParamsAES256 = (encryptedText: string): UserParams => {
  if (!encryptedText?.trim()) {
    throw new Error("Encrypted text is required and cannot be empty");
  }

  try {
    const config = getAESConfig();

    const decrypted = CryptoJS.AES.decrypt(encryptedText, config.key, {
      iv: config.iv,
      mode: CryptoJS.mode.CBC,
    });

    const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);

    if (!decryptedStr) {
      throw new Error(
        "Failed to decrypt: invalid encrypted text or wrong key/IV",
      );
    }

    const parsed = JSON.parse(decryptedStr) as UserParams;

    validateUserParams(parsed.keyspace, parsed.role, parsed.userId);

    return parsed;
  } catch (err) {
    throw new Error(
      `Decryption failed: ${
        err instanceof Error ? err.message : "Unknown error"
      }`,
    );
  }
};
