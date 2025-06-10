# MotionLanguage

MotionLanguage is a minimal, expressive DSL (domain-specific language) for describing object motion and behavior in the browser. It is designed to be readable, composable, and easy to embed in creative tools, animations, interactive scenes, and low-code environments.

---

## Features
DSL Syntax
Simple motion commands:
jump(up);, tremble(left);, breathe();

Timed pauses:
wait 300ms;, wait 2s;

Control flow:

sequence { ... } — run steps in order

parallel { ... } — run steps simultaneously

repeat(n) { ... } — repeat a block n times

Reusable blocks:

define name = { ... }

name(); — invoke defined block

## Example

### Arguments
```motion
jump(up);
tremble(left);
breathe();
```

### Timings
```motion
wait 500ms;
wait 2s;
```

### Composite Blocks
```motion
sequence {
  jump(up);
  wait 300ms;
  breathe();
}

parallel {
  jump(left);
  tremble(right);
}

repeat(3) {
  jump(up);
  wait 100ms;
}
```

### Parsing
- Built with Peggy (PEG.js successor)
- Generates an abstract syntax tree (AST)
- Provides detailed error messages with line/column locations

### Editor Integration
- Integrated with Monaco Editor
- Custom syntax highlighting for motion commands, keywords, numbers, etc.
- Real-time syntax validation with inline error markers

### Editor Integration
- Integrated with Monaco Editor
- Custom syntax highlighting for motion commands, keywords, numbers, etc.
- Real-time syntax validation with inline error markers
