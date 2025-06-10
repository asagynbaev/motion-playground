import CommandBlock from './CommandBlock';

export default function CommandTree({ node, level = 0 }) {
  const indent = { marginLeft: `${level * 1.5}rem`, marginBottom: '0.5rem' };

  if (!node) return null;

  if (node.error) {
    return <div style={{ ...indent, color: '#900' }}>{node.error}</div>;
  }

  switch (node.type) {
    case 'command':
      return <div style={indent}><CommandBlock command={node} /></div>;

    case 'sequence':
      return (
        <div style={indent}>
          <strong>Sequence</strong>
          <div style={{ marginLeft: '1rem' }}>
            {node.children.map((child, idx) => (
              <CommandTree key={idx} node={child} level={level + 1} />
            ))}
          </div>
        </div>
      );

    case 'parallel':
      return (
        <div style={indent}>
          <strong>Parallel</strong>
          <div style={{ marginLeft: '1rem' }}>
            {node.children.map((child, idx) => (
              <CommandTree key={idx} node={child} level={level + 1} />
            ))}
          </div>
        </div>
      );

    case 'repeat':
      return (
        <div style={indent}>
          <strong>Repeat x{node.count}</strong>
          <div style={{ marginLeft: '1rem' }}>
            {node.children.map((child, idx) => (
              <CommandTree key={idx} node={child} level={level + 1} />
            ))}
          </div>
        </div>
      );

    case 'define':
      return (
        <div style={indent}>
          <strong>Define {node.name}</strong>
          <div style={{ marginLeft: '1rem' }}>
            {node.body.map((child, idx) => (
              <CommandTree key={idx} node={child} level={level + 1} />
            ))}
          </div>
        </div>
      );

    case 'program':
      return (
        <div style={indent}>
          <strong>Program</strong>
          <div style={{ marginLeft: '1rem' }}>
            {node.body.map((child, idx) => (
              <CommandTree key={idx} node={child} level={level + 1} />
            ))}
          </div>
        </div>
      );

    default:
      return <div style={indent}>Unknown node type: {node.type}</div>;
  }
}