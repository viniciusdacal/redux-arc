function insertEmojis (string) {
  const searches = [
    ' undefined',
    ' null',
    ' \'',
    ' \\[object Object\\]',
    ' \[0-9\].*',
  ];

  return searches.reduce(
    (str, search, index) => str.replace(new RegExp(`(${search})`, 'g'), ` 👉$1`), string)
}

function visualValue(value) {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return `'${value}'`;
  if (typeof value === 'function') {
    return value.toString().replace(/\n/g, '').replace(/{(.*)}/g, '{ ... }');
  }
  return value;
}

function objToString(obj) {
  let output = [];
  Object.keys(obj).forEach((key) => {
    output.push(`  ${key}: ${visualValue(obj[key])},`);
  });
  return `{\n${output.join('\n')}\n}`;
}

function validateHandlers(handlers) {
  if (!handlers) {
    throw new Error(`Invalid handler: ${handlers}`);
  }
  const isInvalid = Object.keys(handlers).some((key) =>
    key === '[object Object]' ||
    key === 'undefined' ||
    key === 'null' ||
    typeof handlers[key] !== 'function'
  );

  if (isInvalid) {
    throw new Error(
      `All keys must be valid types and all values should be functions:\n${insertEmojis(objToString(handlers))}
    `);
  }
}

export default function createReducers(initialState, handlers) {
  validateHandlers(handlers);

  return (state = initialState, action) => {
    if (!action) {
      return state;
    }

    const handler = handlers[action.type];
    return !handler ? state : handler(state, action);
  }
}
