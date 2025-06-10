const icons = {
  jump: '🕴️',
  tremble: '💥',
  breathe: '😮‍💨',
  rotate: '🔄',
  slide: '➡️',
  scale: '📏',
  glow: '✨',
  bounce: '⬆️',
  wave: '🌊',
  sparkle: '🌟',
  wait: '⏱️',
  default: '❔'
};

export default function CommandBlock({ command }) {
  const icon = icons[command.name] || icons.default;

  if (command.error) {
    return (
      <div
        style={{
          background: '#fdd',
          color: '#900',
          padding: '1rem',
          margin: '0.5rem',
          borderRadius: '12px',
          textAlign: 'center',
          width: '100%',
          fontWeight: 'bold'
        }}
      >
        Error: {command.error}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "inline-block",
        padding: "1rem",
        margin: "0.5rem",
        background: "#eef",
        borderRadius: "12px",
        textAlign: "center",
        width: "120px",
      }}
    >
      <div style={{ fontSize: "2rem" }}>{icon}</div>
      <div>
        <strong>{command.name}</strong>
      </div>
      <div style={{ fontStyle: "italic" }}>{command.arg || "—"}</div>
    </div>
  );
}