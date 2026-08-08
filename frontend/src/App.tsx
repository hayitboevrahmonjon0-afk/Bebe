import { useEffect, useState } from "react";
import {
  getTelegramUser,
  initTelegram,
} from "./services/telegram";
import type { TelegramUser } from "./types/telegram";

function App() {
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    initTelegram();

    const telegramUser = getTelegramUser();

    if (telegramUser) {
      setUser(telegramUser);
    }
  }, []);

  return (
    <main className="app">
      <section className="welcome">
        <div className="bottle">🍾</div>

        <h1>Spin the Bottle</h1>

        {user ? (
          <p>
            Salom,{" "}
            <strong>
              {user.first_name}
            </strong>
            ! 👋
          </p>
        ) : (
          <p>
            Telegram orqali o‘yinga xush kelibsiz!
          </p>
        )}

        <button>
          O‘yinni boshlash
        </button>
      </section>
    </main>
  );
}

export default App;
