import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';
import * as jQuery from 'jquery';

if (environment.production) {
  enableProdMode();
}

jQuery(() => platformBrowserDynamic().bootstrapModule(AppModule));

