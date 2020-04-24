export const reduceHandlers = (handlers, promise) => handlers.reduce(
  (acc, [onResolve, onError]) => acc.then(onResolve, onError),
  promise
);
