import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DelegateRoutingModule } from './delegate-routing.module';
import { DelegateMainComponent } from './components/delegate-main/delegate-main.component';
import { DelegateRegistrationComponent } from './components/delegate-registration/delegate-registration.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { IntlInputPhoneModule } from 'intl-input-phone';
@NgModule({
  declarations: [
    DelegateMainComponent,
    DelegateRegistrationComponent
  ],
  imports: [
    CommonModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DelegateRoutingModule,
    SharedModule,
    NgxIntlTelInputModule,
    IntlInputPhoneModule
  ]
})
export class DelegateModule { }
