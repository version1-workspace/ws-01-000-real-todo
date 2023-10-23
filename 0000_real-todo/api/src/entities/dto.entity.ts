export class Dto<T> {
  get object(): T {
    return Object.keys(this).reduce((acc, it) => {
      return { ...acc, [it]: acc[it] };
    }, {} as T);
  }
}
