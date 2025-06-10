import { useState, useRef } from 'react';
import { parse } from './motionParser';
import { playAST } from './motionPlayer';
import CommandBlock from './CommandBlock';
import CommandTree from './CommandTree';
import './assets/App.css';

import Editor from '@monaco-editor/react';
import { motionDSL } from './motionLanguage';

export default function App() {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const [input, setInput] = useState('jump(up); tremble(left); breathe()');
  const [commands, setCommands] = useState(null);
  const [renderedCommands, setRenderedCommands] = useState([]);

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

  const handleParse = () => {
    try {
      const parsed = parse(input);

      if (!parsed || parsed.type !== 'program' || !Array.isArray(parsed.body)) {
        throw new Error('Parse result is invalid.');
      }

      setCommands(parsed);
      setRenderedCommands([]);

      playAST(parsed, async (cmd) => {
        setRenderedCommands(prev => [...prev, cmd]);
      });
    } catch (e) {
      setCommands({ error: e.message });
      setRenderedCommands([{ error: e.message }]);
    }
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

      <div className="editor-wrapper" style={{ paddingTop: '40px' }}>
        <Editor
          height="300px"
          language="motion-dsl"
          theme="motionTheme"
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
            monaco.editor.defineTheme('motionTheme', {
              base: 'vs',
              inherit: true,
              rules: [
                { token: 'keyword', foreground: '007acc', fontStyle: 'bold' },
                { token: 'type.identifier', foreground: 'aa00aa' },
                { token: 'type.direction', foreground: 'ff8000' },
                { token: 'number', foreground: '008800' },
                { token: 'string', foreground: 'a31515' },
                { token: 'identifier', foreground: '000000' },
              ],
              colors: {
                'editor.background': '#f4faff'
              }
            });
          }}
        />
      </div>

      <div className="play-buttons">
        <button onClick={handleParse}>▶️ Play</button>
        <button onClick={handleExport}>💾 Export</button>
      </div>

      {/* AST Viewer */}
      {commands && commands.type === 'program' && !commands.error && (
        <div className="ast-tree">
          <h3>🧠 Parsed AST:</h3>
          <CommandTree node={commands} />
        </div>
      )}

      {/* Rendered animation */}
      <div className="commands">
        {renderedCommands.map((cmd, idx) => (
          <CommandBlock key={idx} command={cmd} />
        ))}
      </div>

      {/* Live log */}
      {renderedCommands.length > 0 && (
        <pre>
          {JSON.stringify(renderedCommands[renderedCommands.length - 1], null, 2)}
        </pre>
      )}
    </div>
  );
}
