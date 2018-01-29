# Axios HTTP middleware service

Simple [axios](https://github.com/axios/axios) HTTP middleware service to simplify hooking to HTTP requests made through Axios.

## What's this?

There are two classes exposed in this module:

- `HttpMiddleware`: the base class to extend from when creating your own middleware.
- `HttpMiddlewareService` which manages the middleware stack and the hooking into the passed axios.

It works with either the global axios or a local instance.

## Creating your middleware

Here's a simple example of a locale middleware who sets a language header on each AJAX request.

```javascript
import { HttpMiddleware } from 'axios-middleware';

export default class ErrorMiddleware extends HttpMiddleware {
    handleResponseError(error) {
        console.log("Handling:", error);
    }
}
```

## Using the service

Simplest use-case:

```javascript
import axios from 'axios';
import { HttpMiddlewareService } from 'axios-middleware';
import i18n from './i18n';
import { LocaleMiddleware, OtherMiddleware } from './middlewares';

// Create a new service instance
const service = new HttpMiddlewareService(axios);

// Then register your middleware instances.
service.register([
    new LocaleMiddleware(i18n),
    new OtherMiddleware()
]);

// We're good to go!
```

A common use-case would be to expose an instance of the service which consumes an _axios_ instance configured for an API. It's then possible to register middlewares for this API at different stages of the initialization process of an application.
