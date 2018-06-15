/**
 * @property {Array} middlewares stack
 * @property {AxiosInstance} http
 * @property {Function} originalAdapter
 * @property {Number} _requestInterceptor
 * @property {Number} _responseInterceptor
 */
export default class HttpMiddlewareService {
    constructor(axios) {
        this.middlewares = [];

        this.setHttp(axios);
    }

    /**
     * @param {AxiosInstance} axios
     * @returns {HttpMiddlewareService}
     */
    setHttp(axios) {
        this.unsetHttp();

        if (axios) {
            this.http = axios;
            this.originalAdapter = axios.defaults.adapter;
            axios.defaults.adapter = config => this.adapter(config);
        }
        return this;
    }

    /**
     * @returns {HttpMiddlewareService}
     */
    unsetHttp() {
        if (this.http) {
            this.http.defaults.adapter = this.originalAdapter;
            this.http = null;
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
     * Adds a middleware or an array of middlewares to the stack.
     * @param {HttpMiddleware|Array} middlewares
     * @returns {HttpMiddlewareService}
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
        return this;
    }

    /**
     * Removes a middleware from the registered stack.
     * @param {HttpMiddleware} middleware
     * @returns {HttpMiddlewareService}
     */
    unregister(middleware) {
        const index = this.middlewares.indexOf(middleware);
        if (index > -1) {
            this.middlewares.splice(index, 1);
        }
        return this;
    }

    /**
     * Removes all the middleware from the stack.
     * @returns {HttpMiddlewareService}
     */
    reset() {
        this.middlewares.length = 0;
        return this;
    }

    /**
     * @param config
     * @returns {Promise}
     */
    adapter(config) {
        const chain = [conf => this._onSync(this.originalAdapter.call(this.http, conf)), undefined];
        let promise = Promise.resolve(config);

        this.middlewares.forEach((middleware) => {
            chain.unshift(
                middleware.onRequest && (conf => middleware.onRequest(conf)),
                middleware.onRequestError && (error => middleware.onRequestError(error))
            );
        });

        this.middlewares.forEach((middleware) => {
            chain.push(
                middleware.onResponse && (response => middleware.onResponse(response)),
                middleware.onResponseError && (error => middleware.onResponseError(error))
            );
        });

        while (chain.length) {
            promise = promise.then(chain.shift(), chain.shift());
        }

        return promise;
    }

    /**
     * @param promise
     * @returns {Promise}
     * @private
     */
    _onSync(promise) {
        return this.middlewares.reduce(
            (acc, middleware) => (middleware.onSync ? middleware.onSync(acc) : acc),
            promise
        );
    }
}
