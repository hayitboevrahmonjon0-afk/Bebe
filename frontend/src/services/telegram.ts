import type { TelegramUser, TelegramWebApp } from "../types/telegram";

const getWebApp = (): TelegramWebApp | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.Telegram?.WebApp ?? null;
};

export const initTelegram = (): TelegramWebApp | null => {
  const webApp = getWebApp();

  if (!webApp) {
    return null;
  }

  webApp.ready();
  webApp.expand();

  return webApp;
};

export const getTelegramUser = (): TelegramUser | null => {
  const webApp = getWebApp();

  return webApp?.initDataUnsafe?.user ?? null;
};

export const getTelegramInitData = (): string => {
  const webApp = getWebApp();

  return webApp?.initData ?? "";
};

export const haptic = (
  style: "light" | "medium" | "heavy" | "rigid" | "soft" = "light"
) => {
  const webApp = getWebApp();

  webApp?.HapticFeedback?.impactOccurred(style);
};
