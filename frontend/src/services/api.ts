const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface AuthUser {
  id: string;
  telegramId: string;
  username?: string | null;
  firstName: string;
  lastName?: string | null;
  photoUrl?: string | null;
  balance: number;
  level: number;
  experience: number;
  dailyStreak: number;
}

interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  message?: string;
}

export async function authenticateTelegram(
  initData: string
): Promise<AuthUser> {
  if (!initData) {
    throw new Error(
      "Telegram ma'lumotlari topilmadi."
    );
  }

  const response = await fetch(
    `${API_URL}/api/auth/telegram`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        initData,
      }),
    }
  );

  const data =
    (await response.json()) as AuthResponse;

  if (!response.ok || !data.success || !data.user) {
    throw new Error(
      data.message ||
        "Telegram autentifikatsiyasi amalga oshmadi."
    );
  }

  return data.user;
}
