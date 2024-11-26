import { Component } from '@angular/core';
declare var AOS:any;
@Component({
  selector: 'app-download-center',
  templateUrl: './download-center.component.html',
  styleUrls: ['./download-center.component.css']
})
export class DownloadCenterComponent {

  ngOnInit(): void {
    AOS.init({
      duration: 1200,
  })
  console.log("download center");
  
  }
}
