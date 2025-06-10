# MotionLanguage

MotionLanguage is a minimal, expressive DSL (domain-specific language) for describing object motion and behavior in the browser. It is designed to be readable, composable, and easy to embed in creative tools, animations, interactive scenes, and low-code environments.

---

## ✨ Features

### ✅ DSL Syntax
Simple motion commands:
```motion
jump(up);
glow(red);
bounce();
```

Timed pauses:
```motion
wait 300ms;
wait 2s;
```

Control flow:
```motion
sequence { ... }    // Run steps in order
parallel { ... }    // Run steps simultaneously
repeat(3) { ... }   // Repeat a block n times
```

Reusable blocks:
```motion
define name = {
  bounce();
  wait(200ms);
}

name();
```

### 🎨 Canvas Animations
Powered by `<canvas>`:
- `glow(color)` – glowing box
- `bounce()` – vertical jump
- `wave()` – shake left/right
- `sparkle()` – brief flash circle

### 🔠 Command Library
Supported commands:
- `jump(up/down)`
- `tremble(left/right)`
- `breathe()`
- `rotate(clockwise/counterclockwise)`
- `slide(left/right)`
- `scale(number)`
- `glow(color)`
- `bounce()`
- `wave()`
- `sparkle()`
- `wait(duration)` (e.g. `300ms`, `2s`)

### 🧠 Define Blocks (macros)
You can define reusable blocks with:
```motion
define spin = {
  rotate(clockwise);
  wait(1s);
}

spin();
```
_Note: Argument support is not yet available._

### 🛠 Parsing
- Built with [Peggy](https://peggyjs.org) (PEG.js successor)
- Generates a clean abstract syntax tree (AST)
- Provides line/column error locations

### 🧩 Editor Integration
- Uses Monaco Editor
- Live syntax validation
- Custom highlighting for:
  - Keywords (`define`, `repeat`, ...)
  - Commands (`jump`, `glow`, ...)
  - Directions (`up`, `left`, ...)
  - Durations (`500ms`, `2s`)
  - Colors (`red`, `blue`, ...)

---

## ✅ Example
```motion
sequence {
  glow(red);
  jump(up);
  wait(500ms);
  sparkle();
}

repeat(2) {
  bounce();
  wait(300ms);
}

define pulse = {
  scale(1.5);
  wait(400ms);
}

pulse();
```

---

Start creating animated motion logic with zero boilerplate, rich canvas effects, and visual flow control — all in a friendly DSL ✨
