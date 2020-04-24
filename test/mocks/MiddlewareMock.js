const identity = a => a;
const reject = err => Promise.reject(err);

export default class MiddlewareMock {
  constructor(id = 'MiddlewareMock') {
    Object.assign(this, {
      onRequest: jest.fn(identity).mockName(`${id}.onRequest`),
      onRequestError: jest.fn(reject).mockName(`${id}.onRequestError`),
      onSync: jest.fn(identity).mockName(`${id}.onSync`),
      onResponse: jest.fn(response => response).mockName(`${id}.onResponse`),
      onResponseError: jest.fn(reject).mockName(`${id}.onResponseError`),
    });
  }
}
