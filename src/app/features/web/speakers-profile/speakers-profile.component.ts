import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { WebService } from '../webz-services/web.service';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';


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


    this.route.params.subscribe((params: any) => {
      console.log("Params", params);
      if (params != undefined && Object.keys(params).length > 0) {

        this.speakersId = params.speakerId
        this.speakersName = params.speakerName

      }
    });


    this.loadSpeakers()


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


  ngOnDestroy(): void {
    
  }
}
