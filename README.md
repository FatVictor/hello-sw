# Steps

Create application: 
ng new hello-sw --standalone --skip-tests

Enable service worker
ng add @angular/pwa

Add worker
ng g web-worker app

Modify app.config.ts to set your custom ServiceWorker instead of default angular service worker

Add logic to your app.worker.ts
