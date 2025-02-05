import { Component } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-peacekeeper-main',
  templateUrl: './peacekeeper-main.component.html',
  styleUrls: ['./peacekeeper-main.component.css']
})
export class PeacekeeperMainComponent {
  isCollapsed = false;

  constructor(private SharedService: SharedService) {
    this.SharedService.isCollapsed$.subscribe(state => {
      this.isCollapsed = state;
    });
  }
}
