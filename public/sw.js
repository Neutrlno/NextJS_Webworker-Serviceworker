importScripts("./hello.js");

console.log("Sevice worker is active");
self.addEventListener("install", (event) =>
    console.log("Sevice worker is active")
);

self.addEventListener("message", (event) => {
    console.log("SW says:", event.data.message);
});
