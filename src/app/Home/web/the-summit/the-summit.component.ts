import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControlName, FormBuilder, FormArray, AbstractControl, ValidatorFn, } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedService } from 'src/app/shared/services/shared.service';
import { DelegateService } from '../../delegate/services/delegate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-the-summit',
  templateUrl: './the-summit.component.html',
  styleUrls: ['./the-summit.component.css']
})
export class TheSummitComponent implements OnInit{
  events = [
    'Registration',
    'Opening Session',
    'Session Theme 1 - JUSTICE',
    'Launch & Networking',
    'Session Theme 2 - LOVE',
  ];

  speakers: any;

  constructor(
    private formBuilder: FormBuilder,
     private DelegateService: DelegateService,
     private SharedService: SharedService, 
     private ngxService: NgxUiLoaderService, 
     private router: Router) {

   }
   ngOnInit(): void {
  
    this.getInviteSpeakers()
   }
    getInviteSpeakers(){
    this.DelegateService.getSpeakers().subscribe((res: any) => {
      console.log("speakers", res.data);
      this.speakers =res.data;
    }, (err:any) => {
      console.log("error", err);
    });
  }
}
