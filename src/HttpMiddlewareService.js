export default class HttpMiddlewareService {
    constructor(axios) {
        this.http = axios;
        this.middlewares = [];
    }

    has(middleware) {
        return this.middlewares.indexOf(middleware) > -1;
    }
}

//
///**
// * @param {AbstractMiddleware} middleware
// * @returns {boolean} true if the middleware is already registered.
// */
//function has(middleware) {
//    return middlewareStack.indexOf(middleware) > -1;
//}
//
///**
// * Add a middleware or an array of middlewares to the stack.
// * @param {AbstractMiddleware|Array} middlewares
// */
//function register(middlewares) {
//    // eslint-disable-next-line no-param-reassign
//    if (!Array.isArray(middlewares)) middlewares = [middlewares];
//
//    // Test if middlewares are registered more than once.
//    middlewares.forEach((middleware) => {
//        if(has(middleware)
//)
//    {
//        throw new Error('Middleware already registered');
//    }
//    middlewareStack.push(middleware);
//})
//    ;
//}
//
///**
// * Remove a middleware from the registered stack.
// * @param {AbstractMiddleware} middleware
// */
//function unregister(middleware) {
//    const index = middlewareStack.indexOf(middleware);
//    if (index > -1) {
//        middlewareStack.splice(index, 1);
//    }
//}
//
//function reset() {
//    middlewareStack.length = 0;
//}
//
//// Run the middlewares within a HTTP request interceptor.
//onRequest(
//    // on request
//    config = > middlewareStack.reduce(
//    (acc, middleware) = > middleware.onRequest(acc),
//    config,
//),
//// on request error
//(error) =
//>
//{
//    middlewareStack.forEach(middleware = > middleware.handleRequestError(error)
//)
//    ;
//    return Promise.reject(error);
//}
//,
//)
//;
//
//// Run the middlewares within a HTTP response interceptor.
//onResponse(
//    // on response success
//    response = > middlewareStack.reduce(
//    (acc, middleware) = > middleware.onResponse(acc),
//    response,
//),
//// on response error
//(error) =
//>
//{
//    middlewareStack.forEach(middleware = > middleware.handleResponseError(error)
//)
//    ;
//    return Promise.reject(error);
//}
//,
//)
//;
//
//export default {
//    register,
//    unregister,
//    reset,
//};
