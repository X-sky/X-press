import consola from 'consola';

export default new Proxy(consola, {
  get(...args) {
    return Reflect.get(...args);
  }
});
