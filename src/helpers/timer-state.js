const TimerState = delay => {
  let timer = null;
  let resolve = null;
  let reject = null;
  let self = null;

  const startWith = cb => {
    if (timer) clearTimeout(timer);

    timer = setTimeout(
      () => cb().then(resolve, reject), delay
    );

    return self;
  };

  const assignResolveReject = (_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  };

  self = {
    promise: new Promise(assignResolveReject),
    startWith
  };

  return self;
};

export default TimerState;
