# Action Types
Beyond creators, you also receive an object named **types** when you call `createActions`. This object contains all the respective types for your actions.

Given the following config:

```js
const { types } = createActions('myNamespace', {
  list: { url: 'todo', method: 'get' },
  update: { url: 'todo/:id', method: 'put' },
  reset: null,
});
```

Your action types would look exactly like this:

```js
{
  LIST: {
    REQUEST: 'MY_NAMESPACE_LIST_REQUEST',
    RESPONSE: 'MY_NAMESPACE_LIST_RESPONSE',
  },
  UPDATE: {
    REQUEST: 'MY_NAMESPACE_UPDATE_REQUEST',
    RESPONSE: 'MY_NAMESPACE_UPDATE_RESPONSE',
  },
  RESET: 'MY_NAMESPACE_RESET',
};
```

Considering the code above, to get the type for your list response action, you could do the following:

```js
  types.LIST.RESPONSE // MY_NAMESPACE_LIST_RESPONSE
```

**The logic we use to define the types, is basically:**

Convert the action name to Upper Case, splitting words by underscore `_` and use it as the root keys of our action types object:

 ```js
  // list -> LIST
  {
    LIST,
    UPDATE,
    RESET,
  }
 ```



For async types, we add the keys `REQUEST` and `RESPONSE` to all types objects:

 ```js
  // list ->
  {
    LIST: {
      REQUEST,
      RESPONSE,
    },
    UPDATE: {
      REQUEST,
      RESPONSE,
    },
    RESET,
  }
 ```

The final value for the action type, begins with the namespace uppercased, followed by the action name uppercased.  For **Async Actions**, we append respectively, the words `REQUEST` and `RESPONSE`).

```
  myNamespace -> MY_NAMESPACE
  list -> LIST
  reset -> RESET

  MY_NAMESPACE_LIST_REQUEST
  MY_NAMESPACE_LIST_RESPONSE

  MY_NAMESPACE_RESET
```
