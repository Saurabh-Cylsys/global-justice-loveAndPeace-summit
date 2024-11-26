import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PartnerRoutingModule } from './partner-routing.module';
import { PartnerMainComponent } from './components/partner-main/partner-main.component';
import { PartnerRegistrationComponent } from './components/partner-registration/partner-registration.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    PartnerMainComponent,
    PartnerRegistrationComponent
  ],
  imports: [
    CommonModule,
    PartnerRoutingModule,
    FormsModule, ReactiveFormsModule,
    SharedModule
  ]
})
export class PartnerModule { }
