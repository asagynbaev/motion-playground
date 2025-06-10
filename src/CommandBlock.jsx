import { motion } from "framer-motion";

const icons = {
  jump: '🕴️',
  tremble: '💥',
  breathe: '😮‍💨',
  rotate: '🔄',
  slide: '➡️',
  scale: '📏',
  default: '❔'
};

const commandAnimations = {
  jump: (arg) => ({
    y: [0, arg === 'down' ? 30 : -30, 0],
    transition: { duration: 0.6 }
  }),
  tremble: (arg) => {
    const offset = arg === 'right' ? 10 : arg === 'left' ? -10 : 10;
    return {
      x: [0, offset, -offset, offset, 0],
      transition: { duration: 0.5 }
    };
  },
  breathe: () => ({
    scale: [1, 1.2, 1],
    transition: { duration: 1.5 }
  }),
  rotate: (arg) => ({
    rotate: [0, arg === 'counterclockwise' ? -360 : 360],
    transition: { duration: 1 }
  }),
  slide: (arg) => {
    const dist = arg === 'right' ? 100 : arg === 'left' ? -100 : 0;
    return {
      x: [0, dist],
      transition: { duration: 0.8 }
    };
  },
  scale: (arg) => {
    const factor = parseFloat(arg);
    return {
      scale: [1, isNaN(factor) ? 1.5 : factor, 1],
      transition: { duration: 1 }
    };
  }
};

function getAnimation(name, arg) {
  return (commandAnimations[name] || (() => ({})))(arg);
}

export default function CommandBlock({ command }) {
  const icon = icons[command.name] || icons.default;
  const animation = getAnimation(command.name, command.arg);

  if (command.error) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
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
    </motion.div>
  );
}

  return (
    <motion.div
      animate={animation}
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
    </motion.div>
  );
}
