export async function playAST(programNode, renderFn) {
  if (!programNode || programNode.type !== 'program' || !Array.isArray(programNode.body)) {
    console.warn('Invalid AST structure:', programNode);
    return;
  }

  const context = { defines: {} };

  for (const stmt of programNode.body) {
    await playNode(stmt, renderFn, context);
  }
}

async function playNode(node, renderFn, context) {
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
        // вызов макроса
        for (const sub of context.defines[node.name]) {
          await playNode(sub, renderFn, context);
        }
      } else {
        await renderFn(node);
        await delay(1000);
      }
      break;

    case 'sequence':
      for (const child of node.children) {
        await playNode(child, renderFn, context);
      }
      break;

    case 'parallel':
      await Promise.all(node.children.map(c => playNode(c, renderFn, context)));
      break;

    case 'repeat':
      for (let i = 0; i < node.count; i++) {
        for (const child of node.children) {
          await playNode(child, renderFn, context);
        }
      }
      break;

    default:
      console.warn('Unknown node type:', node.type);
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function parseDuration(arg) {
  if (!arg) return 0;

  if (arg.endsWith('ms')) {
    return parseInt(arg.replace('ms', ''));
  }

  if (arg.endsWith('s')) {
    return parseFloat(arg.replace('s', '')) * 1000;
  }

  // fallback to 1s if malformed
  return 1000;
}
