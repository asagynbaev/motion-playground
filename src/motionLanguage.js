export const motionDSL = {
  defaultToken: '',
  tokenPostfix: '.motion',

  keywords: ['define', 'sequence', 'parallel', 'repeat', 'wait'],
  commands: [
    'jump', 'tremble', 'breathe', 'rotate', 'slide', 'scale',
    'glow', 'bounce', 'wave', 'sparkle'
  ],
  directions: ['up', 'down', 'left', 'right', 'clockwise', 'counterclockwise'],
  colors: ['red', 'blue', 'green', 'yellow', 'purple', 'white'],
  operators: ['=', '(', ')', '{', '}', ';'],

  tokenizer: {
    root: [
      [/[a-zA-Z_][\w\-]*/, {
        cases: {
          '@keywords': 'keyword',
          '@commands': 'type.identifier',
          '@directions': 'type.direction',
          '@colors': 'string',
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
