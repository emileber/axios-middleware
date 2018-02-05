# Usage with ES5 in Node

ES5 doesn't have [classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) so you can't use the easy extend syntax sugar. Creating a new middleware from the base `HttpMiddleware` class can still be done with a typical prototype based inheritance pattern.

Create a custom middleware to register.

```javascript
var HttpMiddleware = require('axios-middleware').HttpMiddleware;

function MyMiddleware() {
    // call the parent constructor
    HttpMiddleware.apply(this, arguments);
}

// Prototype wiring
var proto = MyMiddleware.prototype = Object.create(HttpMiddleware.prototype);
proto.constructor = MyMiddleware;

// Method overriding
proto.onRequest = function(config) {
  // handle the request
};

module.exports = MyMiddleware;
```

Then export the service.

```javascript
var axios = require('axios'),
    HttpMiddlewareService = require('axios-middleware').HttpMiddlewareService,
    MyMiddleware = require('./MyMiddleware');

// Create a new service instance
var service = new HttpMiddlewareService(axios);

// Then register your middleware instances.
service.register(new MyMiddleware());

module.exports = service;
```

