/* eslint-disable class-methods-use-this, no-unused-vars */

/**
 * Default middleware implementation. Extend this class to create a custom middleware.
 */
export default class HttpMiddleware {
    /**
     * Default implementation is the identity function.
     * @param {Object} config
     * @returns {Object}
     */
    onRequest(config) {
        return config;
    }

    /**
     * Default implementation is a noop.
     * @param {Object} error
     */
    onRequestError(error) { }

    /**
     * Default implementation is the identity function.
     * @param {Promise} promise
     * @returns {Promise}
     */
    onSync(promise) {
        return promise;
    }

    /**
     * Default implementation is the identity function.
     * @param {Object} response
     * @returns {Object}
     */
    onResponse(response) {
        return response;
    }

    /**
     * Default implementation is a noop.
     * @param {Object} error
     */
    onResponseError(error) { }
}
