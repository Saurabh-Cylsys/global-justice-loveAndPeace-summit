import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpeakerRoutingModule } from './speaker-routing.module';
import { SpeakerMainComponent } from './components/speaker-main/speaker-main.component';
import { SpeakerRegistrationComponent } from './components/speaker-registration/speaker-registration.component';
import { FirstRagistratComponent } from './first-ragistrat/first-ragistrat.component';
import { FirstSpeekarComponent } from './first-speekar/first-speekar.component';
import { FirstPartnerComponent } from './first-partner/first-partner.component';
import { DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [
    SpeakerMainComponent,
    SpeakerRegistrationComponent,
    FirstRagistratComponent,
    FirstSpeekarComponent,
    FirstPartnerComponent
  ],
  imports: [
    DatePipe,
    CommonModule,
    SpeakerRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class SpeakerModule { }
