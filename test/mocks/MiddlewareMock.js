import { HttpMiddleware } from '../../dist/axios-middleware.common';

export default class MiddlewareMock extends HttpMiddleware {
    constructor() {
        super();
        Object.assign(this, {
            onRequest: jest.fn(config => config),
            onRequestError: jest.fn(),
            onSync: jest.fn(promise => promise),
            onResponse: jest.fn(response => response),
            onResponseError: jest.fn(),
        });
    }
}
