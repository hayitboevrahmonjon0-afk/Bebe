import { useEffect, useState } from "react";
import {
  getTelegramUser,
  initTelegram,
  haptic,
} from "./services/telegram";
import type { TelegramUser } from "./types/telegram";

const players = [
  { name: "Aziz", avatar: "😎" },
  { name: "Madina", avatar: "👩" },
  { name: "Jasur", avatar: "🧑" },
  { name: "Malika", avatar: "👩‍🦱" },
];

function App() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [balance, setBalance] = useState(1000);
  const [room, setRoom] = useState("Asosiy xona");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  useEffect(() => {
    initTelegram();

    const telegramUser = getTelegramUser();

    if (telegramUser) {
      setUser(telegramUser);
    }
  }, []);

  const handleBottleClick = () => {
    if (spinning || balance < 10) {
      return;
    }

    haptic("heavy");

    setSelectedPlayer(null);
    setSpinning(true);
    setBalance((current) => current - 10);

    const randomPlayer =
      players[Math.floor(Math.random() * players.length)];

    const extraRotation =
      1440 + Math.floor(Math.random() * 360);

    setRotation((current) => current + extraRotation);

    setTimeout(() => {
      setSpinning(false);
      setSelectedPlayer(randomPlayer.name);
      haptic("success");
    }, 3000);
  };

  return (
    <main className="home">
      <header className="topbar">
        <div className="profile">
          <div className="avatar">
            {user?.photo_url ? (
              <img
                src={user.photo_url}
                alt={user.first_name}
              />
            ) : (
              <span>
                {user?.first_name?.charAt(0) ?? "👤"}
              </span>
            )}
          </div>

          <div>
            <p className="hello">Salom 👋</p>
            <h2>{user?.first_name ?? "Mehmon"}</h2>
          </div>
        </div>

        <div className="balance">
          <span>🪙</span>
          <strong>{balance}</strong>
        </div>
      </header>

      <section className="room-card">
        <div>
          <span className="room-label">Sizning xonangiz</span>
          <h3>🏠 {room}</h3>
        </div>

        <button
          className="change-room"
          onClick={() =>
            setRoom(
              room === "Asosiy xona"
                ? "Do‘stlar xonasi"
                : "Asosiy xona"
            )
          }
        >
          Almashtirish
        </button>
      </section>

      <section className="game-card">
        <div className="game-title">
          <span>🎲</span>

          <div>
            <h1>Spin the Bottle</h1>
            <p>
              {spinning
                ? "Shisha aylanmoqda..."
                : "Shishani bosing"}
            </p>
          </div>
        </div>

        <div className="bottle-area">
          <button
            className={`bottle-button ${
              spinning ? "spinning" : ""
            }`}
            onClick={handleBottleClick}
            disabled={spinning || balance < 10}
            aria-label="Shishani aylantirish"
          >
            🍾
          </button>
        </div>

        {selectedPlayer && !spinning && (
          <div className="selected-player">
            🎯 Tanlangan o‘yinchi:
            <strong>{selectedPlayer}</strong>
          </div>
        )}

        <p className="spin-cost">
          🪙 Bir aylantirish: 10
        </p>
      </section>

      <section className="players">
        <div className="section-title">
          <h2>👥 O‘yinchilar</h2>
          <span>{players.length} kishi</span>
        </div>

        <div className="player-list">
          {players.map((player) => (
            <div
              className="player"
              key={player.name}
            >
              <div className="player-avatar">
                {player.avatar}
              </div>

              <span>{player.name}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
