# axios-middleware

[![Build Status](https://travis-ci.org/emileber/axios-middleware.svg?branch=master)](https://travis-ci.org/emileber/axios-middleware)
[![Dependency Status](https://beta.gemnasium.com/badges/github.com/emileber/axios-middleware.svg)](https://beta.gemnasium.com/projects/github.com/emileber/axios-middleware)
[![npm version](https://badge.fury.io/js/axios-middleware.svg)](https://www.npmjs.com/package/axios-middleware)

Simple [axios](https://github.com/axios/axios) HTTP middleware service.

Explore [**the documentation**](https://emileber.github.io/axios-middleware/).

## Installation

```
npm install --save axios-middleware
```

## How to use

A simple example using the [simplified middleware syntax](https://emileber.github.io/axios-middleware/#/simplified-syntax).

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
export default { service };
```

A common use-case would be to expose an instance of the service which consumes an _axios_ instance configured for an API. It's then possible to register middlewares for this API at different stages of the initialization process of an application.

