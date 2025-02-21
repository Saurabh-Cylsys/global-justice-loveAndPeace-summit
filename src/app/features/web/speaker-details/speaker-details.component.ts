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
  countries: string[] = [];
  selectedCountry: string = '';
  isLoading = true;

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
    this.loadCountries();
    this.isLoading = false;
    }

  loadCountries() {
    // Extract countries from nested speakers array
    const allCountries = this.speakersList.flatMap(group => 
      group.speakers.map((speaker: Speaker) => speaker.Country)
    );
    
    // Get unique countries and sort them
    this.countries = [...new Set(allCountries)]
      .filter(country => country)
      .sort();
  }

  filterSpeakers() {
    // Start with original list
    this.speakersList = [...this.originalSpeakersList];

    // Apply text search if exists
    if (this.searchText) {
      const searchTerm = this.searchText.toLowerCase();
      this.speakersList = this.speakersList.map(group => ({
        ...group,
        speakers: group.speakers.filter((speaker: Speaker) => 
          speaker.Name?.toLowerCase().includes(searchTerm) ||
          speaker.Country?.toLowerCase().includes(searchTerm) ||
          speaker.Credentials?.toLowerCase().includes(searchTerm)
        )
      })).filter(group => group.speakers.length > 0);
    }

    // Apply country filter if selected
    if (this.selectedCountry) {
      this.speakersList = this.speakersList.map(group => ({
        ...group,
        speakers: group.speakers.filter((speaker: Speaker) => 
          speaker.Country === this.selectedCountry
        )
      })).filter(group => group.speakers.length > 0);
    }
  }
}
