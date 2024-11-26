import { Component } from '@angular/core';
declare var AOS:any;
@Component({
  selector: 'app-speaker-post',
  templateUrl: './speaker-post.component.html',
  styleUrls: ['./speaker-post.component.css']
})
export class SpeakerPostComponent {

  ngOnInit(): void {
    AOS.init({
      duration: 1200,
  })
  console.log("speaker-post");
  
  }
}
