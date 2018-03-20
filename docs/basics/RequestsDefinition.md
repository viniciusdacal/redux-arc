# Async actions Definition

Arc provides a declarative interface to define async actions, that allows you to do this in a few lines of code. If you are used with any route system, you will feel like home, if you don't, it will take minutes for you to understand how it works.

First of all, let's see how would look a todo list crud definition, considering a rest api:

Let's consider your base url as `/api`:

```js
import { createActions } from 'redux-arc';

const { types, actions } = createActions('todo', {
  create: { url: '/api/todo',     method: 'post' },
  read:   { url: '/api/todo/:id', method: 'get'  },
  update: { url: '/api/todo/:id', method: 'put'  },
  list:   { url: '/api/todo',     method: 'get'  },
  list:   { url: '/api/todo',     method: 'get'  },
});

actions.read({ id: '123'}); //dispatch read action

types.READ.REQUEST // TODO_READ_REQUEST
types.READ.RESPONSE // TODO_READ_RESPONSE

```

> In the above example, we have our baseUrl as `/api`. If you are using a lib like axios, you can set the **baseUrl** in its config, so, the url definition of `read`, for example, could look like this: `todo/:id` instead of this:`api/todo/:id`

Let's step back and explore each part of this request definition.

#createActions

This function is only a factory that returns the action creators and the action types.

```js
import { createActions } from 'redux-arc';

const { types, actions } = createActions('myNamespace', {
  list: { url: 'path/to/list', method: 'get'},
});
```

As its first param, `createApiAction` expects a namespace, that will be used as a prefix of your types.

The second param is the requests definition object, which should respect the following pattern:

```js
{
  list: {
    url: 'todo',
    method: 'get',
  },
  update: {
    url: 'todo/:id',
    method: 'put',
  }
}
```

As you can see, it's possible to define multiple requests in the same config object, you only need to give it an action name. Considering the above config:

 - **action name** - It's the name you give for each async action. It will be used to generate the action creator and also the action type. In the above example, we have `list` and `update`.

 - **url** - will be passed to `asyncTask` to perform the request. It also accepts dynamic urls, so, you can define an url such as `path/to/resource/:id`.

 - **method** - It will be passed to `asyncTask` as well, in this case, you can use any method your request lib supports, the most common are `post`,`get`, `put` and `delete`.


