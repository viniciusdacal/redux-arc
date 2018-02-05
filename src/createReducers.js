function visualValue(value) {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return `'${value}'`;
  return value;
}

function objToString(obj) {
  if (!obj) {
    return '';
  }
  let output = [];
  Object.keys(obj).forEach((key) => {
    output.push(`\t${key}: ${visualValue(obj[key])},`);
  });
  return `{\t\n${output.join('\n')}\n}`;
}

function validateHandlers(handlers) {
  const isInvalid = Object.keys(handlers).some((key, index) => {
    return !key || key === 'undefined' || typeof handlers[key] !== 'function'
  });
  if (isInvalid) {
    throw new Error(`All keys should be defined  values should be present:\n${objToString(handlers)}`);
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
