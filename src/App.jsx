import { useRef, useState } from 'react';
import { parse } from './motionParser';
import { playAST } from './motionPlayer';
import CommandBlock from './components/CommandBlock';
// import CommandTree from './components/CommandTree';
import { useAnimationState } from './useAnimationState';
import CanvasScene from './components/CanvasScene';
import Editor from '@monaco-editor/react';
import { motionDSL } from './motionLanguage';
import './assets/App.css';

export default function App() {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const [input, setInput] = useState('jump(up); glow(red); bounce();');
  const [commands, setCommands] = useState(null);
  const [renderedCommands, setRenderedCommands] = useState([]);

  const {
    canvasRef,
    position,
    setPosition,
    style,
    setStyle
  } = useAnimationState();

  const validateInput = (code) => {
    const monaco = monacoRef.current;
    const editor = editorRef.current;
    if (!monaco || !editor) return;

    const model = editor.getModel();

    try {
      parse(code);
      monaco.editor.setModelMarkers(model, 'owner', []);
    } catch (e) {
      const loc = e.location ?? {
        start: { line: 1, column: 1 },
        end: { line: 1, column: 1 }
      };

      monaco.editor.setModelMarkers(model, 'owner', [
        {
          startLineNumber: loc.start.line,
          startColumn: loc.start.column,
          endLineNumber: loc.end.line,
          endColumn: loc.end.column,
          message: e.message,
          severity: monaco.MarkerSeverity.Error
        }
      ]);
    }
  };

  const handleParse = async () => {
    try {
      const parsed = parse(input);
      if (!parsed || parsed.type !== 'program' || !Array.isArray(parsed.body)) {
        throw new Error('Parse result is invalid.');
      }

      setCommands(parsed);
      setRenderedCommands([]);

      await playAST(parsed, (cmd) => {
        setRenderedCommands(prev => [...prev, cmd]);
      }, {
        canvasRef,
        position,
        setPosition,
        setStyle
      });
    } catch (e) {
      setCommands({ error: e.message });
      setRenderedCommands([{ error: e.message }]);
    }
  };

  const handleReset = () => {
    setRenderedCommands([]);
    setPosition({ x: 180, y: 130 });
    setStyle({ glow: null });
  };

  const handleExport = () => {
    if (!commands || commands.type !== 'program') return;

    const filtered = commands.body.filter(c => !c.error);
    const json = JSON.stringify(filtered, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'motion-playlist.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      <h1>🎮 Motion Playground</h1>

      <Editor
        height="300px"
        language="motion-dsl"
        theme="vs-dark"
        value={input}
        onChange={(value) => {
          const code = value ?? '';
          setInput(code);
          validateInput(code);
        }}
        onMount={(editor, monaco) => {
          editorRef.current = editor;
          monacoRef.current = monaco;

          monaco.languages.register({ id: 'motion-dsl' });
          monaco.languages.setMonarchTokensProvider('motion-dsl', motionDSL);
        }}
      />

      <div className="play-buttons">
        <button onClick={handleParse}>▶️ Play</button>
        <button onClick={handleReset}>🔄 Reset</button>
        <button onClick={handleExport}>💾 Export</button>
      </div>

      <CanvasScene canvasRef={canvasRef} position={position} style={style} />

      

      <div className="commands">
        {renderedCommands.map((cmd, idx) => (
          <CommandBlock key={idx} command={cmd} />
        ))}
      </div>

      {renderedCommands.length > 0 && (
        <pre>{JSON.stringify(renderedCommands[renderedCommands.length - 1], null, 2)}</pre>
      )}
    </div>
  );
}
