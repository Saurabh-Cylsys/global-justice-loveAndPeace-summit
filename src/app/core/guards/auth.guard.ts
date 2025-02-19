import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { PeacekeeperService } from 'src/app/features/peacekeeper/services/peacekeeper.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(private peacekeeperService: PeacekeeperService, private router: Router) {}

  canActivate(): boolean {
    if (!this.peacekeeperService.isAuthenticated()) {
      this.router.navigate(['/login']); // Redirect to login if no token
      return false;
    }
    return true;
  }

}
