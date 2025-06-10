// motionLanguage.js
export const motionDSL = {
  defaultToken: '',
  tokenPostfix: '.motion',

  keywords: ['define', 'sequence', 'parallel', 'repeat', 'wait'],
  commands: ['jump', 'tremble', 'breathe'],
  directions: ['up', 'down', 'left', 'right'],
  operators: ['=', '(', ')', '{', '}', ';'],

  tokenizer: {
    root: [
      [/[a-zA-Z_][\w\-]*/, {
        cases: {
            '@keywords': 'keyword',
            '@commands': 'type.identifier',
            '@directions': 'type.direction',
            '@default': 'identifier'
        }
      }],
      [/[{}]/, 'delimiter.bracket'],
      [/\(/, 'delimiter.parenthesis'],
      [/\)/, 'delimiter.parenthesis'],
      [/;/, 'delimiter'],
      [/[0-9]+(ms|s)?/, 'number'],
      [/".*?"/, 'string'],
      [/\s+/, 'white']
    ]
  }
};
