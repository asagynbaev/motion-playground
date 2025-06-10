import CommandBlock from './CommandBlock';

export default function CommandTree({ node, level = 0 }) {
  const indent = { marginLeft: `${level * 1.5}rem` };

  if (!node) return null;

  if (node.type === 'command') {
    return <div style={indent}><CommandBlock command={node} /></div>;
  }

  if (node.type === 'sequence') {
    return (
      <div style={indent}>
        📏 Sequence
        {node.children.map((child, idx) => (
          <CommandTree key={idx} node={child} level={level + 1} />
        ))}
      </div>
    );
  }

  if (node.type === 'parallel') {
    return (
      <div style={indent}>
        ⚡ Parallel
        {node.children.map((child, idx) => (
          <CommandTree key={idx} node={child} level={level + 1} />
        ))}
      </div>
    );
  }

  if (node.type === 'repeat') {
    return (
      <div style={indent}>
        🔁 Repeat x{node.count}
        {node.children.map((child, idx) => (
          <CommandTree key={idx} node={child} level={level + 1} />
        ))}
      </div>
    );
  }

  if (node.error) {
    return <div style={indent}>❌ {node.error}</div>;
  }

  return null;
}
