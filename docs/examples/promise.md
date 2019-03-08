# Returning promises

Every method of our middleware are promise callback functions, meaning that they can return either a value, a new promise or throw an error and the middleware chain will react accordingly.

```javascript
export default class DemoPromiseMiddleware {
  onRequest(config) {
    return asyncChecks().then(() => config);
  }

  onResponseError({ config } = {}) {
    if (config && !config.hasRetriedRequest) {
      // Retrying the request
      return this.http({
        ...config,
        hasRetriedRequest: true,
      })
      .catch(function (error) {
        console.log('Retry failed:', error);
        throw error;
      });
    }
    throw err;
  }
}
```
