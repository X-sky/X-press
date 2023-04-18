export const requestA = (str) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('requestA准备返回');
      resolve(`200ms延迟，从requestA返回结果：${str}`);
    }, 200);
  });
};

export const requestB = (str) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('requestB准备返回');
      resolve(`1s延迟，从另一个请求requestB返回结果：${str}`);
    }, 1000);
  });
};
export const requestServer = (signal) => {
  return fetch('/api', { signal })
    .then((response) => {
      console.log('server返回了', response);
      return response.text();
    })
    .catch((err) => {
      // console.warn(err);
    });
};
export const requestServerDelay = (signal) => {
  return fetch('/api/delay', { signal })
    .then((response) => {
      console.log('delay server返回了', response);
      return response.text();
    })
    .catch((err) => {
      // console.warn(err);
    });
};
