# Request and response values
When you start a request, dispatching an async action, There are two different actions that are dispatched by Arc. One action when the request starts, and another when it ends.

Let's observe the following example:

```js
const { creators, types } = createApiActions('todo', {
  update: { url: 'todo/:id', method: 'put' }
})
```

We can start a request, by dispatching the async action:

```js
  dispatch(creators.update({
    id: '123',
    payload: {
      description: 'Implement Arc in the project',
      date: '2017-10-03',
    }
  }));
```

## Request action
Then, Arc will dispatch an action notifying that the request has been started. The action would be like the following:

```js
  {
    type: 'TODO_UPDATE_REQUEST',
    meta: {
      id: '123',
      url: 'todo/123',
      method: 'put',
    },
    payload: {
      description: 'Implement Arc in the project',
      date: '2017-10-03',
    },
  }
```

Using the **types** object, you can have access to that action type, using the below code:

```js
  types.UPDATE.REQUEST
```

In that case, you could start creating your reducer such as below:

```js
const INITIAL_STATE = {
  updateInProcess: false,
  updateResult: null,
  updateError: null,
};

function toDoReducer(state = INITIAL_STATE, action) {
  if (action.type === types.UPDATE.REQUEST) {
    return {
      ...state,
      updateError: INITIAL_STATE.updateError,
      updateInProcess: true,
    }
  }
  return state;
}
```

In the example above, every time a update request starts, we reset the value **updateError** for its initial state, which is `null`, we also set **updateInProcess** as true.

If we need, we could also use the **id**, **url** or **method** in our reducers, accessing it from **action.meta**

## Response Action
When the request ends, Arc will dispatch the response action, which would look like the following example:

```js
  {
    type: 'TODO_UPDATE_RESPONSE',
    meta: {
      id: '123',
      url: 'todo/123',
      method: 'put',
    },
    payload: THE PROPER RESPONSE FROM YOUR ENDPOINT,
  }
```

The above example is considering a successful request. In case of error, the action would come with a key error and the value for it would be true. The payload would be the error itself. The error action would be like this:

```js
  {
    type: 'TODO_UPDATE_RESPONSE',
    meta: {
      id: '123',
      url: 'todo/123',
      method: 'put',
    },
    error: true,
    payload: THE PROPER ERROR,
  }
```

Let's update our reducer based on the above examples:

```js
const INITIAL_STATE = {
  updateInProcess: false,
  updateResult: null,
  updateError: null,
};

function toDoReducer(state = INITIAL_STATE, action) {
  if (action.type === types.UPDATE.REQUEST) {
    return {
      ...state,
      updateError: INITIAL_STATE.updateError,
      updateInProcess: true,
    }
  }
  if (action.type === types.UPDATE.RESPONSE) {
    if (action.error) {
      return {
        ...state,
        updateInProcess: INITIAL_STATE.updateInProcess,
        updateError: action.payload,
      };
    }
    return {
      ...state,
      updateInProcess: INITIAL_STATE.updateInProcess,
      updateResult: action.payload,
    };
  }
  return state;
}
```

In the example above, first we check if the **action.error** is **true**, and if it's, we set the **action.payload** to **updateError** and we reset **updateInProcess** to its initial state.

If no error is present, we set the action.payload to updateResult but we also reset **updateInProcess**.

