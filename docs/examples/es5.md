# Usage with ES5 in Node

ES5 doesn't have [classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) so you can't use the easy extend syntax sugar. Creating a new middleware from a base middleware class can still be done with a typical prototype based inheritance pattern.

Create a custom middleware to register.

```javascript
var BaseMiddleware = require('./base-middleware');

function MyMiddleware() {
  // call the parent constructor
  BaseMiddleware.apply(this, arguments);
}

// Prototype wiring
var proto = MyMiddleware.prototype = Object.create(BaseMiddleware.prototype);
proto.constructor = MyMiddleware;

// Method overriding
proto.onRequest = function(config) {
  // handle the request
  return config;
};

module.exports = MyMiddleware;
```

Then export the service.

```javascript
var axios = require('axios'),
    Service = require('axios-middleware').Service,
    MyMiddleware = require('./MyMiddleware');

// Create a new service instance
var service = new Service(axios);

// Then register your middleware instances.
service.register(new MyMiddleware());

module.exports = service;
```
