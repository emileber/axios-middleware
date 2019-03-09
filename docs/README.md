# Axios HTTP middleware service

Simple [axios](https://github.com/axios/axios) HTTP middleware service to simplify hooking (and testing of hooks) to HTTP requests made through Axios.

## What's this?

A [`HttpMiddlewareService`](api/Service.md) which manages a middleware stack and hooking itself to an axios instance.

Middlewares are just objects or classes composed of simple methods for different points in a request lifecycle.

It works with either the global axios or a local instance.

## Why not use interceptors?

Using axios interceptors makes the code tightly coupled to axios and harder to test.

This middleware service module:

- offers more functionalities (e.g. see [`onSync`](api/methods?id=onsyncpromise))
- looser coupling to axios
- really easy to test middleware classes

It improves readability and reusability in a centralized hooking strategy.

## Examples

All examples are written using ES6 syntax but you can definitely use this plugin with ES5 code, even directly in the browser.

### Simplest use-case

?> A common use-case would be to expose an instance of the service which consumes an _axios_ instance configured for an API. It's then possible to register middlewares for this API at different stages of the initialization process of an application.

The following example is using the [simplified syntax](simplified-syntax.md).

```javascript
import axios from 'axios';
import { Service } from 'axios-middleware';

const service = new Service(axios);

service.register({
  onRequest(config) {
    console.log('onRequest');
    return config;
  },
  onSync(promise) {
    console.log('onSync');
    return promise;
  },
  onResponse(response) {
    console.log('onResponse');
    return response;
  }
});

console.log('Ready to fetch.');

// Just use axios like you would normally.
axios('https://jsonplaceholder.typicode.com/posts/1')
  .then(({ data }) => console.log('Received:', data));
```

It should output:

```
Ready to fetch.
onRequest
onSync
onResponse
Received: {userId: 1, id: 1, title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit", body: "quia et suscipit↵suscipit recusandae consequuntur …strum rerum est autem sunt rem eveniet architecto"}
```

[**Demo snippet**](https://jsfiddle.net/emileber/sfqo0rt1/5/)
