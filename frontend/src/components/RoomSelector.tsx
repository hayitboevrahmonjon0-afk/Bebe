interface Room {
  id: string;
  name: string;
  players: number;
  emoji: string;
}

interface RoomSelectorProps {
  currentRoom: string;
  onSelect: (room: Room) => void;
  onClose: () => void;
}

const rooms: Room[] = [
  {
    id: "main",
    name: "Asosiy xona",
    players: 12,
    emoji: "🔥",
  },
  {
    id: "friends",
    name: "Do‘stlar xonasi",
    players: 8,
    emoji: "👥",
  },
  {
    id: "fun",
    name: "Fun xona",
    players: 16,
    emoji: "🎉",
  },
  {
    id: "love",
    name: "Love xona",
    players: 6,
    emoji: "❤️",
  },
];

export default function RoomSelector({
  currentRoom,
  onSelect,
  onClose,
}: RoomSelectorProps) {
  return (
    <div className="room-overlay">
      <div className="room-modal">
        <div className="room-modal-header">
          <div>
            <span className="modal-label">XONA</span>
            <h2>Xonani tanlang</h2>
          </div>

          <button
            className="close-button"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="room-options">
          {rooms.map((room) => {
            const active = room.name === currentRoom;

            return (
              <button
                key={room.id}
                className={`room-option ${
                  active ? "active" : ""
                }`}
                onClick={() => onSelect(room)}
              >
                <span className="room-emoji">
                  {room.emoji}
                </span>

                <span className="room-info">
                  <strong>{room.name}</strong>
                  <small>
                    👥 {room.players} o‘yinchi
                  </small>
                </span>

                {active && (
                  <span className="selected-mark">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <p className="room-note">
          🔓 Xonaga kirish uchun kod kerak emas.
        </p>
      </div>
    </div>
  );
}
