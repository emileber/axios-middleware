export default class MiddlewareMock {
  constructor() {
    Object.assign(this, {
      onRequest: jest.fn(config => config),
      onRequestError: jest.fn(),
      onSync: jest.fn(promise => promise),
      onResponse: jest.fn(response => response),
      onResponseError: jest.fn(),
    });
  }
}
