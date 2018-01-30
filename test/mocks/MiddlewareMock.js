import { HttpMiddleware } from '../../dist/axios-middleware.common';

export default class MiddlewareMock extends HttpMiddleware {
    constructor() {
        super();
        this.mocks = {
            onRequest: jest.fn(),
            handleRequestError: jest.fn(),
            onResponse: jest.fn(),
            handleResponseError: jest.fn(),
        };
    }

    onRequest(config) {
        this.mocks.onRequest(config);
        return config;
    }

    handleRequestError(error) {
        this.mocks.handleRequestError(error);
    }

    onResponse(response) {
        this.mocks.onResponse(response);
        return response;
    }

    handleResponseError(error) {
        this.mocks.handleResponseError(error);
    }
}
