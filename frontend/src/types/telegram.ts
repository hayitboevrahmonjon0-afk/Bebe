export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    query_id?: string;
    auth_date?: number;
    hash?: string;
  };

  ready: () => void;
  expand: () => void;
  close: () => void;

  MainButton: {
    text: string;
    color: string;
    textColor: string;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
  };

  HapticFeedback: {
    impactOccurred: (
      style: "light" | "medium" | "heavy" | "rigid" | "soft"
    ) => void;

    notificationOccurred: (
      type: "error" | "success" | "warning"
    ) => void;

    selectionChanged: () => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}
