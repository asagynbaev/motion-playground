export async function playAST(programNode, renderFn, { setPosition, setStyle, canvasRef, position }) {
  const context = { defines: {} };

  for (const stmt of programNode.body) {
    await playNode(stmt);
  }

  async function playNode(node) {
    if (!node) return;

    switch (node.type) {
      case 'define':
        context.defines[node.name] = node.body;
        break;

      case 'command':
        if (node.name === 'wait') {
          const ms = parseDuration(node.arg);
          await delay(ms);
        } else if (context.defines[node.name]) {
          for (const sub of context.defines[node.name]) {
            await playNode(sub);
          }
        } else {
          await renderFn(node);
          await handleCommand(node);
        }
        break;

      case 'sequence':
        for (const child of node.children) {
          await playNode(child);
        }
        break;

      case 'parallel':
        await Promise.all(node.children.map(playNode));
        break;

      case 'repeat':
        for (let i = 0; i < node.count; i++) {
          for (const child of node.children) {
            await playNode(child);
          }
        }
        break;

      default:
        console.warn('Unknown node type:', node.type);
    }
  }

  async function handleCommand(cmd) {
    const { name, arg } = cmd;
    const canvas = canvasRef?.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    switch (name) {
      case 'glow':
        return animateGlow(arg, setStyle);
      case 'bounce':
        return animateBounce(setPosition);
      case 'wave':
        return animateWave(setPosition);
      case 'sparkle':
        return animateSparkle(ctx, position);
    }
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function parseDuration(arg) {
    if (!arg) return 0;
    if (arg.endsWith('ms')) return parseInt(arg);
    if (arg.endsWith('s')) return parseFloat(arg) * 1000;
    return 1000;
  }
}

export function animateGlow(color, setStyle) {
  return new Promise(resolve => {
    setStyle({ glow: color });
    setTimeout(resolve, 500);
  });
}

export function animateBounce(setPosition) {
  return new Promise(resolve => {
    setPosition(prev => ({ ...prev, y: prev.y - 30 }));
    setTimeout(() => {
      setPosition(prev => ({ ...prev, y: prev.y + 30 }));
      resolve();
    }, 300);
  });
}

export function animateWave(setPosition) {
  return new Promise(resolve => {
    setPosition(prev => ({ ...prev, x: prev.x + 20 }));
    setTimeout(() => {
      setPosition(prev => ({ ...prev, x: prev.x - 40 }));
      setTimeout(() => {
        setPosition(prev => ({ ...prev, x: prev.x + 20 }));
        resolve();
      }, 150);
    }, 150);
  });
}

export function animateSparkle(ctx, position) {
  return new Promise(resolve => {
    ctx.fillStyle = 'gold';
    ctx.beginPath();
    ctx.arc(position.x + 20, position.y + 20, 10, 0, 2 * Math.PI);
    ctx.fill();
    setTimeout(() => {
      ctx.clearRect(0, 0, 400, 300);
      resolve();
    }, 500);
  });
}
