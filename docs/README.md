# Axios HTTP middleware service

Simple [axios](https://github.com/axios/axios) HTTP middleware service to simplify hooking to HTTP requests made through Axios.

## What's this?

There are two classes exposed in this module:

- [`HttpMiddleware`](api/HttpMiddleware.md): the base class to extend from when creating your own middleware.
- [`HttpMiddlewareService`](api/HttpMiddlewareService.md) which manages the middleware stack and the hooking into the passed axios.

It works with either the global axios or a local instance.

## Why not use interceptors?

Using axios interceptors makes the code tightly coupled to axios and harder to test.

This middleware service module:

- offers more functionalities (e.g. see [`onSync`](api/HttpMiddleware?id=onsyncpromise))
- looser coupling to axios
- really easy to test middleware classes

It improves readability and reusability.

## Examples

All examples are written using ES6 syntax but you can definitely use this plugin with ES5 code, even directly in the browser.

### Simplest use-case

?> A common use-case would be to expose an instance of the service which consumes an _axios_ instance configured for an API. It's then possible to register middlewares for this API at different stages of the initialization process of an application.

The following example is using the [simplified syntax](simplified-syntax.md).

```javascript
import axios from 'axios';
import { HttpMiddlewareService } from 'axios-middleware';

// Create a new service instance
const service = new HttpMiddlewareService(axios);

// Then register your middleware instances.
service.register({
    onRequest(config) {
        // handle the request config
        return config;
    },
    onSync(promise) {
        // handle the promsie
        return promise;
    },
    onResponse(response) {
        // handle the response
        return response;
    }
});

// We're good to go!
export default service;
```

