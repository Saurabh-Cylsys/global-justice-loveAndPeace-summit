import { Component } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-peacekeeper-header',
  templateUrl: './peacekeeper-header.component.html',
  styleUrls: ['./peacekeeper-header.component.css']
})
export class PeacekeeperHeaderComponent {
  isCollapsed = false;

  constructor(private SharedService: SharedService,) {
    this.SharedService.isCollapsed$.subscribe(state => {
      this.isCollapsed = state;
    });
  }
  toggleSidebar() {
    this.SharedService.toggleSidebar(); // Call the service method
  }
}
