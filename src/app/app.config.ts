import {ApplicationConfig, isDevMode,} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideServiceWorker} from '@angular/service-worker';
import {HashLocationStrategy, LocationStrategy} from "@angular/common";


let generatedServiceWorkerUrl: string
(function generateUrl(): void {
  // Override the real Worker with a stub
  // to return the filename, which will be generated/replaced by the worker-plugin.
  // @ts-ignore
  Worker = class ServiceWorker {
    constructor(public stringUrl: string, public options?: WorkerOptions) {
    }
  };

  const worker = new Worker(new URL("./app.worker", import.meta.url), {type: "module"}) as any;
  generatedServiceWorkerUrl = worker.stringUrl;
})();

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    provideServiceWorker(generatedServiceWorkerUrl, {
      enabled: true,//for testing
      // enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })]
};
