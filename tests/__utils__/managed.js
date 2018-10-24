const wrap = (callback, fn, args, updateStatus) => resultObj => process.nextTick(
  () => {
    callback(
      resultObj != null ? resultObj.result : fn(...args)
    );
    updateStatus();
  }
);

const manage = fn => {
  let _promise = null;
  let _resolve = null;
  let _reject = null;
  let _status = 'pending';

  const createPromise = (fn, args) => {
    _promise = new Promise(
      (resolve, reject) => {
        _resolve = wrap(resolve, fn, args, () => { _status = 'resolved'; });
        _reject = wrap(reject, fn, args, () => { _status = 'rejected'; });
      }
    );
    return _promise;
  };

  const managed = (...args) => _promise || createPromise(fn, args);

  managed.resolve = resultObj => {
    if (!_promise) createPromise(fn, []);
    _resolve(resultObj);
  };

  managed.reject = resultObj => {
    if (!_promise) createPromise(fn, []);
    _reject(resultObj);
  };

  managed.isResolved = () => (
    _status === 'resolved'
  );

  managed.isRejected = () => (
    _status === 'rejected'
  );

  managed.isPending = () => (
    _status === 'pending'
  );

  return managed;
};

export default manage;