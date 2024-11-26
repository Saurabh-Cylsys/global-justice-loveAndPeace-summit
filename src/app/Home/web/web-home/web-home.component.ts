import { Component } from '@angular/core';

import { Router } from '@angular/router';

declare var AOS: any;

@Component({

  selector: 'app-web-home',

  templateUrl: './web-home.component.html',



  styleUrls: ['./web-home.component.css']

})



export class WebHomeComponent {



  ngOnInit(): void {

    AOS.init({

      duration: 1200,

    })

    console.log("home");



  }





  constructor(



    private router: Router,



  ) {



  }

  toggle() {

    this.router.navigateByUrl('/aboutUs');

  }





  navigate() {

    console.log("del");

    this.router.navigate(['/delegate-registration'])

    // this.router.navigate[('/delegate-registration')];



  }

}