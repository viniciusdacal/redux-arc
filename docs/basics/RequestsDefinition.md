# Requests Definition

Arc provides a declarative interface to define your requests, that allows you to do this in a few lines of code. If you are used with any route system, you will feel like home, if you don't, it will take minutes for you to understand how it works.

First of all, let's see how would look a todo list crud definition, considering a restfull api:

```js
import { createActions } from 'redux-arc';

const baseUrl = 'http://localhost:4000/api';

const { types, actions } = createActions('todo', {
  create: {
    url: `${baseUrl}/todo`,
    method: 'post',
  },
  read: {
    url: `${baseUrl}/todo/:id`,
    method: 'get',
  },
  update: {
    url: `${baseUrl}/todo/:id`,
    method: 'put',
  },
  list: {
    url: `${baseUrl}/todo`,
    method: 'get',
  },
  list: {
    url: `${baseUrl}/todo`,
    method: 'get',
  },
});

actions.read({ id: '123'}); //dispatch read action

types.READ.REQUEST // TODO_READ_REQUEST
types.READ.RESPONSE // TODO_READ_RESPONSE

```

> In the above example, we defined a variable called baseUrl to be used in our Url's definitions. If you are using a lib like axios, you can set the **baseUrl** in its config, so, the url definition of `read`, for example, could look like this: `todo/:id` instead of this:`${baseUrl}/todo/:id`

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

The second param is the requests definition object, which should respect the following schema:

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

As you can see, it's possible to define multiple requests in the same config object, you only need to give it an identifier. Let's explore the above schema:

 - **identifier** - It's the name you give for each request. It will be used to generate the action creators and also the action types. In the above example, we have `list` and `update`.
 - **url** - will be passed to `asyncTask` to perform the request. It also accepts dynamic urls, so, you can define a url such as `path/to/resource/:id`.
 - **method** - It will be passed to `asyncTask` as well, in this case, you can use any method your request lib supports, the most common are `post`,`get`, `put` and `delete`.


