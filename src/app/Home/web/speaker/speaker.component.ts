import { Component } from '@angular/core';
declare var AOS:any;

@Component({
  selector: 'app-speaker',
  templateUrl: './speaker.component.html',
  styleUrls: ['./speaker.component.css']
})
export class SpeakerComponent {
  ngOnInit(): void {
    AOS.init({
      duration: 1200,
  })
  console.log("speaker");
  
  }
}
