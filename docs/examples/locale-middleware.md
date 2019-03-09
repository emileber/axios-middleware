# Locale middleware

Here's a simple example of a locale middleware who sets a language header on each request.

```javascript
export default class LocaleMiddleware {
  constructor(i18n) {
    this.i18n = i18n;
  }

  onRequest(config) {
    // returns a new Object to avoid changing the config object referenced.
    return {
      ...config,
      headers: {
        // default `locale`, can still be overwritten by config.headers.locale
        locale: this.i18n.lang,
        ...config.headers
      }
    };
  }
}
```
