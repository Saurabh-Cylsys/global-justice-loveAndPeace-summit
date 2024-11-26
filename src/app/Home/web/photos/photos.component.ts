import { Component } from '@angular/core';
declare var AOS:any;
@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent {
  ngOnInit(): void {
    AOS.init({
      duration: 1200,
  })
  }
}
