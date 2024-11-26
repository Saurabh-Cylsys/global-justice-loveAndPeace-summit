import { Component } from '@angular/core';
declare var AOS:any;
@Component({
  selector: 'app-speaker-main',
  templateUrl: './speaker-main.component.html',
  styleUrls: ['./speaker-main.component.css']
})
export class SpeakerMainComponent {
  ngOnInit(): void {
    AOS.init({
      duration: 1200,
  })
  }
}
