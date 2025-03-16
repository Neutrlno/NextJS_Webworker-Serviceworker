"use client";
import { useEffect, useRef, useCallback, useState } from "react";

export default function Index() {
    const workerRef = useRef<Worker>(null);
    const swRef = useRef<ServiceWorkerContainer>(null);
    const [count, setCount] = useState(0);
    const [fib, setFib] = useState({ fib: 0, res: 0, time: 0 });

    useEffect(() => {
        swRef.current = navigator.serviceWorker;
        swRef.current.register("./sw.js")
            .then((registration) => {
                console.log(
                    "SW scope: ",
                    registration.scope,
                );
            })
            .catch((err) => {
                console.log("Service Worker registration failed: ", err);
            });
        swRef.current.controller.postMessage({
            message: "Hello from the main app!",
        });
        swRef.current.addEventListener('message', (e) => console.log(e.data))
        // ----------------------------------- //
        workerRef.current = new Worker(new URL("../worker.ts", import.meta.url));
        workerRef.current.onmessage = (event) => {
            console.log("WebWorker returned result", event.data);
            setFib({ ...event.data });
        };
        return () => workerRef.current?.terminate();
    }, []);

    const handleWork = useCallback(() => {
        swRef.current.controller.postMessage({
            message: count,
        });
        workerRef.current?.postMessage(count);
    }, [count]);

    return (
        <>
            <div>This ui stays responsive despite the "heavy calculation"</div>
            <div>
                fib for {count}
                <button onClick={() => setCount(count + 1)}>+</button>
                <button onClick={() => setCount(count - 1)}>-</button>
            </div>
            <button onClick={handleWork}>Calculate</button>
            <div>
                fib number: {fib.fib} is {fib.res} and it took {fib.time} ms to
                calc
            </div>
        </>
    );
}

