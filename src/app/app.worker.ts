/// <reference lib="webworker" />

addEventListener('message', ({data}) => {
    const response = `worker response to ${data}`;
    console.log(response);
    // postMessage(response);
});

let currentToken: string = ''
let currentRefreshToken: string = ''
addEventListener("install", (event: any) => {
    // TS doesn't know skipWaiting, need to ignore it
    //@ts-ignore
    event.waitUntil(skipWaiting());
    console.log("Service worker installed!");
});

addEventListener("activate", (event: any) => {
    // TS doesn't know clients, need to ignore it
    // @ts-ignore
    event.waitUntil(clients.claim());
    console.log("Service worker ready!");
});

addEventListener("fetch", (event: any) => {
    const headers = new Headers(event.request.headers);
    headers.append("Authorization", `Bearer fakeauthen`);
    const authReq = new Request(event.request, {headers});
    event.respondWith(fetch(authReq))
    // const destURL = new URL(event.request.url);
    // if (isLoginRequest(destURL)) {
    //     const authReq = new Request(event.request);
    //     event.respondWith(hackResponse(authReq, destURL));
    // } else if (currentToken) {
    //     if (isRefreshRequest(destURL)) {
    //         const headers = new Headers(event.request.headers);
    //         headers.append("Authorization", `Bearer ${currentToken}`);
    //         const authReq = new Request(event.request, {headers, body: JSON.stringify({token: currentRefreshToken})});
    //         event.respondWith(hackResponse(authReq, destURL));
    //     } else if (isLogoutRequest(destURL)) {
    //         currentToken = '';
    //         currentRefreshToken = '';
    //         const headers = new Headers(event.request.headers);
    //         headers.append("Authorization", `Bearer ${currentToken}`);
    //         const authReq = new Request(event.request, {headers});
    //         event.respondWith(hackResponse(authReq, destURL));
    //     } else if (isApiRequest(destURL)) {
    //         const headers = new Headers(event.request.headers);
    //         headers.append("Authorization", `Bearer ${currentToken}`);
    //         const authReq = new Request(event.request, {headers});
    //         event.respondWith(fetch(authReq))
    //     }
    // }
});

const hackResponse = async (authReq: Request, url: URL) => {
    const response = await fetch(authReq);
    // catch response and set token
    const data = await response.json();
    const {data: {auth, refresh}, ...body} = data;
    currentToken = auth;
    currentRefreshToken = refresh || currentRefreshToken;
    // return response;
    // Retrieve token and send the response without it
    return new Response(JSON.stringify(body), {
        headers: response.headers,
        status: response.status,
        statusText: response.statusText,
    });
};


const isApiRequest = (url: URL) => url.pathname.startsWith("/api");
const isLoginRequest = (url: URL) => url.pathname === "/api/management/auth/login";
const isRefreshRequest = (url: URL) => url.pathname === "/api/management/auth/refresh";
const isLogoutRequest = (url: URL) => url.pathname === "/api/management/auth/logout";
