import { Component, OnInit } from '@angular/core';
import { data } from 'jquery';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-peacekeeper-header',
  templateUrl: './peacekeeper-header.component.html',
  styleUrls: ['./peacekeeper-header.component.css']
})
export class PeacekeeperHeaderComponent implements OnInit{
userData:any
date:any
  ngOnInit(): void {
    this.date = new Date
   this.userData = JSON.parse(localStorage.getItem('userDetails') || '')
  }
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
