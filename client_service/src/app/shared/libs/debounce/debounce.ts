function debounce<F extends (...args: any[]) => void>(func: F, delay: number) {
  let timeoutId: NodeJS.Timeout;

  return function debounced(this: ThisParameterType<F>, ...args: Parameters<F>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  } as F;
}


export default debounce;