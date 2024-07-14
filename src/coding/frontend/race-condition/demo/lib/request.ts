export const requestA = (str: string) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      console.log('requestA准备返回');
      resolve(`requestA有200ms延迟，从requestA返回结果：${str}`);
    }, 200);
  });
};

export const requestB = (str: string) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      console.log('requestB准备返回');
      resolve(`requestB有1s延迟，从另一个请求requestB返回结果：${str}`);
    }, 1000);
  });
};
