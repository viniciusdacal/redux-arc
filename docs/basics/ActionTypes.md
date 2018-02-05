# Action Types
Beyond creators, you also receive an object named **types** when you call `createActions`. This object contains all the respective types for your requests.

Given the following config:

```js
const { types } = createActions('myNamespace', {
  list: { url: 'todo', method: 'get' },
  update: { url: 'todo/:id', method: 'put' }
})
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
};
```

Considering the code above, to get the type for your list response action, you could do the following:

```js
  types.LIST.RESPONSE // MY_NAMESPACE_LIST_RESPONSE
```

The logic we use to define the types, is basically:
 - Convert the request identifier to Upper Case and use it to name the root keys of our action types object
 - Add the keys REQUEST and RESPONSE to all request types objects
 - The final value for the action type, begins with the namespace then has the identifier for the request and lastly, has the request period (REQUEST or RESPONSE).

Feel free to use these types in your reducers or whatever you would use other action types.
