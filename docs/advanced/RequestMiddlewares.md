# Request Middlewares
Request middlewares, as the name says, are middlewares that you can apply to specific requests. Lets say you want to format your payload before the request, but only in a few cases. Or you would like to process some response, before it goes to the reducers. For all these edge cases, you can use a request middleware.

# Saving a session token into localStorage
Let's imagine you have a login request, that returns a session token in case of success. On the response, you need to get that token and save it to the browser's localStorage. That could be fairly easy to handle with a middleware.

Let's take a look into the whole code for that and then go through it, step by step.

Below you can see the middleware's code:

```js
// saveUserSession.js
function saveUserSession() {
  return done => (action, error, response) => {
    if (response && response.token) {
      localStorage.setItem('$token', response.token);
    }
    return done(action, error, response);
  };
}
saveUserSession.applyPoint = 'onResponse';

export default saveUserSession;
```

As we can observe in the above code, request middlewares are very similar to redux's middlewares. The big difference is that redux middlewares watches all application actions, while request middlewares you apply as you need, for specific requests.

A middleware should also contain a property `applyPoint`, which should be either `'onRequest'` or `'onResponse'`. The applyPoint tells in which moment of the request the middleware will be executed. Considering we need the token that comes in the response, we use the applyPoint `'onResponse'`.

Going to the code inside the middleware, we call the function **done**, passing the same params we received. We do that because we don't want to intercept the action or modify the response, we only intend to use the response value. But we still do a **return** of the result of **done**, to not break the promise chain.

After that, we check if the response is valid and then we save the token in the localStorage.


## Applying middlewares to requests
To use a middleware, is fairly simple, you only need to *import* and include it in an array under a property **middlewares** in the action config. Take a look at the following example:


```js
import { createActions } from 'redux-arc';
import saveUserSession from  './saveUserSession';

const { types, creators } = createActions('user', {
  login: {
    url: 'user/login',
    method: 'post',
    middlewares: [saveUserSession],
  },
});

dispatch(creators.login({
  email: 'user@test.com',
  password: '123',
}));
```


We are defining a login request, and we are applying the middleware we created to it. Then, we use the creator to dispatch the action that will start the request, passing the email and password in the payload.

providing the middleware in the config, makes the middleware run every time you call that request. But let's say you would like to apply the middleware in a single call to that request, then you could do the following:

```js
import saveUserSession from  './saveUserSession';

const { types, creators } = createActions('user', {
  login: {
    url: 'user/login',
    method: 'post',
  },
});

dispatch(creators.login({
  email: 'user@test.com',
  password: '123',
  middlewares: [saveUserSession],
}));
```

In the code above, instead of apply the middleware to all login requests, we apply to the single call we are doing.

## onRequest middlewares
In the previous example we used the applyPoint `'onResponse'`, because we wanted to access the response value. In the following example, we are going to use the applyPoint `'onRequest'`, because we will process and change the payload before it goes to the request.


## Saving an user
So, let's imagine you would like to create and update a user, but you wouldn't like to configure two different requests to do that. You would rather to config a single request named **save** and when you call it passing a user without an id, it would understand that you were intending to do a creation request, otherwise, it would assume you were trying to update the user, and would do the necessary changes on the request data to ensure the update would work. You could create a middleware to handle that scenario, and name it **createOrUpdate**. Let's do it.


```js
function createOrUpdate() {
  return done => (action, error, response) => {
    const { payload, meta } = action;

    if (!payload.id) {
      return done(action, error, response);
    }

    const { id, ...user } = payload;

    const updateAction = {
      ...action,
      payload: user,
      meta: { url: `${meta.url}/${id}`, method: 'put', id },
    };
    return done(updateAction, error, response);
  }
}
createOrUpdate.applyPoint = 'onRequest';

export default createOrUpdate;
```

> In the cases your middleware has an applyPoint `onRequest`, you would have access only to the `action` object, unless another middleware created an  `error` or `response` in the `onRequest` chain.

The first thing we do in the middleware, is check for the `payload.id`. If none is present, we assume this request intends to create an user and we assume the original request config is prepared to do that, having the method as `post`, and having the proper url for the creation. That said, we only need to let the request happens normally, calling the function **done**, passing the params we received.

If there's an id present, we create another action, modifying the **url** to include the **id** and also changing the method, to `put`. Once we do that, we only need to call **done**, providing modified action.

And that's it, our **createOrUpdate** middleware is done. Now, let's take a look on how to use it.

```js
import { createActions } from 'redux-arc';
import createOrUpdate from  './createOrUpdate';

const { types, creators } = createActions('user', {
  save: {
    url: 'user',
    method: 'post',
    middlewares: [createOrUpdate]
  },
});

dispatch(creators.save({
  name: 'My New user',
  email: 'user@redux-arc.org',
}));

dispatch(creators.save({
  id: '123'
  name: 'My Edited user',
  email: 'user@redux-arc.org',
}));
```

First, we define the request as it would be for the creation, passing the url as `user` and the method as `post`. Then, we add the middleware to it.

In the first dispatching, the payload does not contain the id, so it will create an user. The second dispatch contains the id and will be an update.

> Usually, for `onRequest` you would change only the action value, and for `onResponse`, you would change only the response. But feel free to change the action inside  `onResponse` cycle if that makes sense.

Remember that when you create a middleware, you can use it in different request. This last middleware for example, you could use to create and save todo items, or into any crud your application has.

Request middlewares can be used in many different ways, adding flexibility to the requests.
