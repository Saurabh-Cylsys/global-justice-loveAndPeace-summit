import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { WebService } from '../webz-services/web.service';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-speakers-profile',
  templateUrl: './speakers-profile.component.html',
  styleUrls: ['./speakers-profile.component.css']
})
export class SpeakersProfileComponent implements OnInit {
  speakersDetails: any[] = [];
  speakersId: any;
  speakersName: any = '';
  isLoading = true;
 totalColor :  any[] = [];
  tinyURL : string = environment.tinyUrl;

  constructor(
    private webService: WebService,
    private datePipe: DatePipe,
    private SharedService: SharedService,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2
  ) { }
  
  

  

  ngOnInit(): void {
    this.getrandomcolor(10)


    this.route.params.subscribe((params: any) => {
      console.log("Params", params);
      if (params != undefined && Object.keys(params).length > 0) {

        this.speakersId = params.speakerId
        this.speakersName = params.speakerName

      }
    });


    this.loadSpeakers()


  }

  
  getrandomcolor(length:any) {
    let letters = '0123456789ABCDEF';
  
    for (let i = 0; i < length; i++) {
      let color = '#';
      for (let j = 0; j < 6; j++) {
        color += letters[Math.floor(Math.random() * 16)];
      }    this.totalColor.push(color);
    }
  
    console.log(this.totalColor);
  }

  loadSpeakers() {
    this.isLoading = true;

    // Prepare the search text - if country is selected, include it in the search

    this.webService.getSpeakersList('', '73', this.speakersId)
      .subscribe({

        next: (response: any) => {
          if (response?.data) {
            debugger
            this.speakersDetails = response?.data;
            this.speakersDetails[0].speaker_details = JSON.parse(this.speakersDetails[0].speaker_details)

            console.log(this.speakersDetails, 'list of speakers');


            // this.speakersDetails[0].speaker_details = this.transformSpeakerData(this.speakersDetails[0].speaker_details);
            // this.speakersDetails[0].speaker_details = [...this.speakersDetails[0].speaker_details];

          } else {
            this.speakersDetails = [];

          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching speakers:', error);
          this.isLoading = false;
          this.speakersDetails = [];
        }
      });
  }
 
  private transformSpeakerData(data:any): any[] {
    // Group speakers into chunks of 4 speakers per group
    const groupSize = 2;
    const groups = [];
    
    for (let i = 0; i < data.length; i += groupSize) {
      groups.push({
        details: data.slice(i, i + groupSize)
      });
    }
    
    return groups;
  }

  navigateUrl() {
     const tinyUrlWithParams = `${this.tinyURL}`;
    // const tinyUrlWithParams = `${'https://tinyurl.com/3322sj49'}`;  //for local testing only
        window.location.href = tinyUrlWithParams;

  }
  ngOnDestroy(): void {
    
  }
}
