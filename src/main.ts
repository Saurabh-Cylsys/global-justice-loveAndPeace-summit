import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

if (window.location.pathname === "/") {
  window.location.href = "/assets/static/index.html";
} else {
 

  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
}
