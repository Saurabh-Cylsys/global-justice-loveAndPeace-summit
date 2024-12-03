import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';

declare var AOS: any;

@Component({

  selector: 'app-web-home',

  templateUrl: './web-home.component.html',



  styleUrls: ['./web-home.component.css']

})



export class WebHomeComponent implements OnInit{
  // headerIcon:any
  constructor(private _router: Router,private _activeRouter:ActivatedRoute, private SharedService: SharedService
  ) {}
  events = [
    'Registration',
    'Opening Session',
    'Session Theme 1 - JUSTICE',
    'Launch & Networking',
    'Session Theme 2 - LOVE',
  ];
  ngOnInit(): void {

    AOS.init({

      duration: 1200,

    })

    console.log("home");

   this.SharedService.headerIcon =  this._router.routerState.snapshot.url;

  }






  toggle() {

    this._router.navigateByUrl('/aboutUs');

  }





  navigate() {

    console.log("del");

    this._router.navigate(['/delegate-registration'])

    // this._router.navigate[('/delegate-registration')];



  }

}