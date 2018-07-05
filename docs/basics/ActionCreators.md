# Action Creators

An action creator, is a function that returns an action. Simple action creators should look just like this:

```js

  const add = payload => ({
    type: 'TODO_ADD',
    payload,
  });

  const reset = () => ({
    type: 'TODO_RESET',
  });
```

The problem is, when you are in a real project, you will have far more actions than only two, and you always have to define these creators.

99% of times, they are just like the code above. You always have to define a name for your **creator**, then you have to define a **type** that has (or at least should) the same name as the **creator**, but uppercased. Then you receive some arguments in the function, inject them in the action and return the action. This process is too repetitive.

To solve that issue, Arc has the `createActions` method, which generates types and action creator for you, based on a config.

Take a look at the example below:

```js
  import { createActions } from 'redux-arc';

  const { creators } = createActions('todo', {
    add: null,
    reset: null,
  })
```


The above config would generate a **creators**, similar to the object below:

```js
  {
    add: function (payload, meta, error) {},
    reset: function (payload, meta, error) {},
  }
```

Those action creators can be used the same way as regular action creators are. So, having access to `dispatch` function, you can just do the following:

```js
  const payload = {
    // any payload
  };
  const meta {
    // any meta
  };
  dispatch(creators.add(payload, meta));

  /*
  {
    type: 'TODO_ADD',
    payload: {},
    meta: {},
  }
  */
```

The arguments `payload` and `meta` are not required. To dispatch a *reset action*, for example, as we are not going to use either **payload** neither **meta** inside our reducers, we can call the creator straight away, without passing any argument:

```js
  dispatch(creators.reset());

  /*
  {
    type: 'TODO_RESET',
  }
  */
```

## Providing default payload and meta for the action
You may be asking yourself why we always have to provide a `null` in the action config. One of the reasons, is because we accept some extra options to generate the actions. You could provide a default `payload`, a default `meta` or a default `error`, for example:

```js

  const anyDefaultPayload = {};
  const anyDefaultMeta = {};

  const { creators } = createActions('todo', {
    add: {
      payload: anyDefaultPayload,
      meta: anyDefaultMeta,
      error: false, // always a boolean;
    },
    reset: null,
  });
```

Besides a default values, Arc also accepts a param `url`, which will create a different kind of action, a **async action**.


# Async Action

By Arc's point of view, a async action that contains the necessary information to trigger a async request. It has some additional info, as `url` and `method` and it also has two types instead of just one.

Through the `createActions` factory, Arc allows you to create **async creators** and **async types** too, in order to make your life easier when you need to deal with this subject. The way you generate them is very similar to regular actions. Take a look below:


```js
const { creators } = createActions('todo', {
  list: { url: 'api/todo', method: 'get' },
  update: { url: 'api/todo/:id', method: 'put' },
  reset: null,
})
```

As you can see, the api is nearly the same, you just need to provide the params `url` and `method` to make it work.

 - **url**: an endpoint to make the requests. It also accepts dynamic params, as you can see in the config to **update** request. We defined a `:id` which will be parsed when we call the creator providing the actual param.
 - **method**: Any http method your request lib supports. ('get', 'post', etc...)
 - **middlewares**: Arc also accepts middlewares in the action config, to give you flexibility to handle edge cases. You can check them at: [Request Middlewares](http://redux-arc.js.org/docs/advanced/RequestMiddlewares.html)


Given the above config, to start a list request, you could just do the following:

```js
  dispatch(creators.list());
```

First, `creators.list` will return the following action:

```js
  {
    type: ['MY_NAMESPACE_LIST_REQUEST', 'MY_NAMESPACE_LIST_RESPONSE'],
    meta: {
      url: 'api/todo',
      method: 'get',
    },
  }
```

And then, the function dispatch, will dispatch it for redux.

The way we use `creators.update` is very similar, the only two differences are:
 - We need to provide a **payload**, that will be the request's payload itself.
 - We need to provide a param **id**, that will be used to parse the dynamic url.

Take a look in the example below:

```js
  const payload = {
    description: 'Implement Arc in the project',
    date: '2017-10-03',
  };

  const meta = { id: '123' };

  dispatch(creators.update(payload, meta));
```

The above creator, generates the following action:

```js
  {
    type: ['MY_NAMESPACE_UPDATE_REQUEST', 'MY_NAMESPACE_UPDATE_RESPONSE'],
    payload: {
      description: 'Implement Arc in the project',
      date: '2017-10-03',
    },
    meta: {
      url: 'todo/123',
      method: 'put',
      id: '123',
    },
  }
```

> When the above action is dispatched, Arc's middleware intercepts it, parses the values and passes the options to **asyncTask** perform the request.

Notice that, those actions generated by Arc's creators, have an array containing two strings instead of being only a simple string. That's how Arc's middleware identifies them as Async Actions. Also, the first type is used in the action dispatched right before the request starts and the second is used to dispatch an action right after we get a response.

## Providing url as function
Arc also supports url as a function that expects params as its first argument and returns a string, as the following example:

```js
const { creators } = createActions('todo', {
  read: {
    url: params => `todo/${params.id}`,
    method: 'get',
  }
})
```
