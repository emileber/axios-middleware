# Usage in the browser

The _axios-middleware_ plugin is made to be easily used in the browser right away.

## Common usage

Just use the short middleware syntax to quickly define one-time use middleware.

```html
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script src="https://unpkg.com/axios-middleware/dist/axios-middleware.min.js"></script>
<script>
    // Create a new service instance
    var service = new HttpMiddlewareService(axios);
    
    // Then register your middleware instances.
    service.register({
        onRequest: function(config) {
            // handle the request
        },
        onResponseError(error) {
            // handle the response error
        }
    });
</script>
```


## Advanced usage

A mix of the ES5 usage within a common namespacing pattern for an app.

Define your middlewares within a `Middleware.js` file.

```javascript
// Middleware.js
var app = app || {};

/**
* Custom Middleware class
*/
app.MyMiddleware = (function(){
    function MyMiddleware() {
    }
    
    var proto = MyMiddleware.prototype = Object.create();
    
    proto.constructor = MyMiddleware;
    proto.onRequest = function(config) {
      // handle the request
    };
    return MyMiddleware;
})();
```

Then register these middlewares with a newly created `HttpMiddlewareService` instance.

```javascript
// Service.js
var app = app || {};

/**
* Middleware Service
*/
app.MiddlewareService = (function(MiddlewareService, MyMiddleware) {
    // Create a new service instance
    var service = new MiddlewareService(axios);
    
    // Then register your middleware instances.
    service.register(new MyMiddleware());
    
    return service;
})(AxiosMiddleware.Service, app.MyMiddleware);
```

In this case, the order in which to import the JS files is important.

```html
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script src="https://unpkg.com/axios-middleware/dist/axios-middleware.min.js"></script>
<script src="Middleware.js"></script>
<script src="Service.js"></script>
```

?> At that point, you may realise that it's a lot of files. You might want to think about using a bundler like [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/guide/en), or a simple concatenation pipeline with [grunt](https://gruntjs.com/) or [gulp](https://gulpjs.com/).
