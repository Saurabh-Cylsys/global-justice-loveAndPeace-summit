import { Component } from '@angular/core';
declare var AOS:any;
@Component({
  selector: 'app-media-partners',
  templateUrl: './media-partners.component.html',
  styleUrls: ['./media-partners.component.css']
})
export class MediaPartnersComponent {
  ngOnInit(): void {
    AOS.init({
      duration: 1200,
  })
  }
}
