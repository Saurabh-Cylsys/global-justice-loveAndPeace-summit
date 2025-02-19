import { Component } from '@angular/core';
import { WebService } from '../webz-services/web.service';

@Component({
  selector: 'app-speaker-details',
  templateUrl: './speaker-details.component.html',
  styleUrls: ['./speaker-details.component.css']
})
export class SpeakerDetailsComponent {
  slides : any = []
  speakersList: any[] = [];

   constructor(
      private webService: WebService,
    ) {}
   ngOnInit() {
  
      this.webService.getSpeakers().subscribe((data:any) => {
        this.slides = data;
      });

      this.speakersList = this.webService.getSpeakerDetailsData();
    console.log('list', this.speakersList);
    }
}
