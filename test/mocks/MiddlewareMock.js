import { HttpMiddleware } from '../../dist/axios-middleware.common';

export default class MiddlewareMock extends HttpMiddleware {
    constructor() {
        super();
        this.mocks = {
            onRequest: jest.fn(),
            onRequestError: jest.fn(),
            onResponse: jest.fn(),
            onResponseError: jest.fn(),
        };
    }

    onRequest(config) {
        this.mocks.onRequest(config);
        return config;
    }

    onRequestError(error) {
        this.mocks.onRequestError(error);
    }

    onResponse(response) {
        this.mocks.onResponse(response);
        return response;
    }

    onResponseError(error) {
        this.mocks.onResponseError(error);
    }
}
