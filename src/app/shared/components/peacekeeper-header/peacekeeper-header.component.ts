import { Component, OnInit } from '@angular/core';
import { data } from 'jquery';

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

}
