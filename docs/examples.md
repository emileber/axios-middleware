# Examples

All examples are written using ES6 syntax but you can definitely use this plugin with ES5 code.

## Locale middleware

Here's a simple example of a locale middleware who sets a language header on each AJAX request.

```javascript
import { HttpMiddleware } from 'axios-middleware';

export default class LocaleMiddleware extends HttpMiddleware {
    constructor(i18n) {
        super();
        this.i18n = i18n;
    }
    
    onRequest(config) {
        config.headers = {
            locale: this.i18n.lang,
            ...config.headers
        };
        return config;
    }
}
```

## Exposing the service instance

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

export default service;
```

## Usage with ES5 in Node

Create a custom middleware to register.

```javascript
var HttpMiddleware = require('axios-middleware').HttpMiddleware;

function MyMiddleware() {
    // call the parent constructor
    HttpMiddleware.apply(this, arguments);
}

var proto = MyMiddleware.prototype = Object.create(HttpMiddleware.prototype);

proto.constructor = MyMiddleware;
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

## Usage in the browser

```html
<script>
var MyHttpService = (function(HttpMiddleware, HttpMiddlewareService) {
    function MyMiddleware() {
        // call the parent constructor
        HttpMiddleware.apply(this, arguments);
    }
    
    var proto = MyMiddleware.prototype = Object.create(HttpMiddleware.prototype);
    
    proto.constructor = MyMiddleware;
    proto.onRequest = function(config) {
      // handle the request
    };
    
    // Create a new service instance
    var service = new HttpMiddlewareService(axios);
    
    // Then register your middleware instances.
    service.register(new MyMiddleware());
    
    return service;
})(AxiosMiddleware.HttpMiddleware, AxiosMiddleware.HttpMiddlewareService);
</script>
```
