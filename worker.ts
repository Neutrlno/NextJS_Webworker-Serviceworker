import fib from "./utils/fib";

self.addEventListener("message", (event) => {
    const start = Date.now();
    const res = fib(event.data);
    postMessage({ res, time: Date.now() - start, fib: event.data });
    console.log('WebWorker job dobe', res);
});

