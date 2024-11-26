import { Component } from '@angular/core';
declare var AOS:any;
@Component({
  selector: 'app-agenda-pharma-preconnect',
  templateUrl: './agenda-pharma-preconnect.component.html',
  styleUrls: ['./agenda-pharma-preconnect.component.css']
})
export class AgendaPharmaPreconnectComponent {

  ngOnInit(): void {
    AOS.init({
      duration: 1200,
  })
  console.log("agenda");
  
  }
}
