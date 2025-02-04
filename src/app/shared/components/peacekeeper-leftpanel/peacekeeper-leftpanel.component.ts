import { Component } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-peacekeeper-leftpanel',
  templateUrl: './peacekeeper-leftpanel.component.html',
  styleUrls: ['./peacekeeper-leftpanel.component.css']
})
export class PeacekeeperLeftpanelComponent {
isCollapsed = false;

  constructor(private SharedService: SharedService,) {
    this.SharedService.isCollapsed$.subscribe(state => {
      this.isCollapsed = state;
    });
  }
}
