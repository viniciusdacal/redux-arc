function validateHandlers(handlers) {
  Object.keys(handlers).forEach((key, index) => {
    if (!key || key === 'undefined') {
      throw new Error(`Error with handler key at index ${index}. All the keys must be defined.`);
    }

    if (typeof handlers[key] !== 'function') {
      throw new Error(`Error with reducer at index ${index}. All the handlers must be functions.`);
    }
  });
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
