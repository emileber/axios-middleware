export default class HttpMiddlewareService {
    constructor(axios) {
        this.middlewares = [];

        this.setHttp(axios);
    }

    /**
     * @param {Axios} axios
     */
    setHttp(axios) {
        this.unsetHttp();

        if (axios) {
            this.http = axios;

            const interceptors = axios.interceptors;

            this._requestInterceptor = interceptors.request.use(
                config => this._onRequest(config),
                error => this._onRequestError(error)
            );
            this._responseInterceptor = interceptors.response.use(
                response => this._onResponse(response),
                error => this._onResponseError(error)
            );
        }
        return this;
    }

    unsetHttp() {
        if (this.http) {
            const interceptors = this.http.interceptors;
            interceptors.request.eject(this._requestInterceptor);
            interceptors.response.eject(this._responseInterceptor);
        }
        return this;
    }

    /**
     * @param {HttpMiddleware} middleware
     * @returns {boolean} true if the middleware is already registered.
     */
    has(middleware) {
        return this.middlewares.indexOf(middleware) > -1;
    }

    /**
     * Add a middleware or an array of middlewares to the stack.
     * @param {HttpMiddleware|Array} middlewares
     */
    register(middlewares) {
        // eslint-disable-next-line no-param-reassign
        if (!Array.isArray(middlewares)) middlewares = [middlewares];

        // Test if middlewares are registered more than once.
        middlewares.forEach((middleware) => {
            if (this.has(middleware)) {
                throw new Error('Middleware already registered');
            }
            this.middlewares.push(middleware);
        });
    }

    /**
     * Remove a middleware from the registered stack.
     * @param {HttpMiddleware} middleware
     */
    unregister(middleware) {
        const index = this.middlewares.indexOf(middleware);
        if (index > -1) {
            this.middlewares.splice(index, 1);
        }
    }

    reset() {
        this.middlewares.length = 0;
    }

    _onRequest(config) {
        return this.middlewares.reduce(
            (acc, middleware) => (middleware.onRequest ? middleware.onRequest(acc) : acc),
            config);
    }

    _onRequestError(error) {
        this.middlewares.forEach(middleware => middleware.onRequestError &&
            middleware.onRequestError(error));
        return Promise.reject(error);
    }

    _onResponse(response) {
        return this.middlewares.reduceRight(
            (acc, middleware) => (middleware.onResponse ? middleware.onResponse(acc) : acc),
            response);
    }

    _onResponseError(error) {
        for (let i = this.middlewares.length; i--;) {
            const middleware = this.middlewares[i];
            if (middleware.onResponseError) middleware.onResponseError(error);
        }
        return Promise.reject(error);
    }
}
