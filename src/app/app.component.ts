import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, fromEvent, mapTo, merge, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { SwUpdate } from '@angular/service-worker';
import { PeacekeeperService } from './features/peacekeeper/services/peacekeeper.service';
declare var AOS:any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'microsite';
  deferredPrompt: any;
  showInstallButton = false;

  ngOnInit(): void {

  }

  online$: Observable<boolean> = of(false);

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private swUpdate: SwUpdate,
    private peacekeeperService : PeacekeeperService) {
    // this.setupVisibilityChange();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/login' && this.peacekeeperService.isAuthenticated()) {
          this.router.navigate(['/dashboard']);
        }
      }
    });

    swUpdate.available.subscribe(event => {
      console.log('Update available:', event);
      if (confirm('A new version of the app is available. Reload to update?')) {
        window.location.reload();
      }
    });

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.deferredPrompt = event;
      this.showInstallButton = true;
    });

    swUpdate.checkForUpdate().then(() => {
      console.log('Checked for updates manually.');
    });

    swUpdate.activated.subscribe((event) => {
      console.log('Update activated:', event);
      alert('The app has been updated to the latest version.');
    });
    this.online$ = merge(

      of(navigator.onLine),

      fromEvent(window, 'online').pipe(mapTo(true)),

      fromEvent(window, 'offline').pipe(mapTo(false))

    );
  }

  installPwa() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        this.deferredPrompt = null;
        this.showInstallButton = false;
      });
    }
  }

}

