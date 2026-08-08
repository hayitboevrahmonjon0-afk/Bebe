import crypto from "node:crypto";

interface TelegramAuthResult {
  valid: boolean;
  user?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    photo_url?: string;
  };
}

export function validateTelegramInitData(
  initData: string,
  botToken: string
): TelegramAuthResult {
  try {
    const params = new URLSearchParams(initData);

    const receivedHash = params.get("hash");

    if (!receivedHash) {
      return { valid: false };
    }

    params.delete("hash");

    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    const secretKey = crypto
      .createHmac("sha256", "WebAppData")
      .update(botToken)
      .digest();

    const calculatedHash = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");

    const hashesMatch = crypto.timingSafeEqual(
      Buffer.from(calculatedHash, "hex"),
      Buffer.from(receivedHash, "hex")
    );

    if (!hashesMatch) {
      return { valid: false };
    }

    const authDate = Number(params.get("auth_date"));

    if (!authDate || !Number.isFinite(authDate)) {
      return { valid: false };
    }

    const currentTime = Math.floor(Date.now() / 1000);

    const maxAge = 24 * 60 * 60;

    if (currentTime - authDate > maxAge) {
      return { valid: false };
    }

    const userData = params.get("user");

    if (!userData) {
      return { valid: false };
    }

    const user = JSON.parse(userData);

    if (!user?.id || !user?.first_name) {
      return { valid: false };
    }

    return {
      valid: true,
      user,
    };
  } catch {
    return {
      valid: false,
    };
  }
}
