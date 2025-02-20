import { Component, OnInit } from '@angular/core';
import { WebService } from '../webz-services/web.service';

interface Speaker {
  Name: string;
  Country: string;
  Credentials: string;
  Profile_Photo?: string;
}

@Component({
  selector: 'app-speaker-details',
  templateUrl: './speaker-details.component.html',
  styleUrls: ['./speaker-details.component.css']
})
export class SpeakerDetailsComponent implements OnInit {
  slides : any = []
  speakersList: any[] = [];
  originalSpeakersList: any[] = []; // Store original list
  searchText: string = '';

   constructor(
      private webService: WebService,
    ) {}
   ngOnInit() {
  
      this.webService.getSpeakers().subscribe((data:any) => {
        this.slides = data;
      });

      this.speakersList = this.webService.getSpeakerDetailsData();
      this.originalSpeakersList = [...this.speakersList]; // Make a copy of original list
    console.log('list', this.speakersList);
    }

  filterSpeakers() {
    if (!this.searchText) {
      this.speakersList = [...this.originalSpeakersList];
      return;
    }

    const searchTerm = this.searchText.toLowerCase();
    this.speakersList = this.originalSpeakersList.map(group => ({
      ...group,
      speakers: group.speakers.filter((speaker: Speaker) => 
        speaker.Name?.toLowerCase().includes(searchTerm) ||
        speaker.Country?.toLowerCase().includes(searchTerm) ||
        speaker.Credentials?.toLowerCase().includes(searchTerm)
      )
    })).filter(group => group.speakers.length > 0);
  }
}
