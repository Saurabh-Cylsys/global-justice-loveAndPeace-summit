import { Component } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  isCollapsed = false;

  constructor(private SharedService: SharedService,) {
    this.SharedService.isCollapsed$.subscribe(state => {
      this.isCollapsed = state;
    });
  }
}
