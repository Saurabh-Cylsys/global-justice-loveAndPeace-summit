import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeacekeeperRoutingModule } from './peacekeeper-routing.module';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditBadgeComponent } from './components/edit-badge/edit-badge.component';
import { SentInvitationComponent } from './components/sent-invitation/sent-invitation.component';
import { InvitationListComponent } from './components/invitation-list/invitation-list.component';
import { PeacekeeperMainComponent } from './components/peacekeeper-main/peacekeeper-main.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxEditorModule } from 'ngx-editor';
import { ContactListComponent } from './components/contact-list/contact-list.component';
import { UploadContactsComponent } from './components/upload-contacts/upload-contacts.component';
import { EditorModule } from 'primeng/editor';
import { ImageCropperModule } from 'ngx-image-cropper';
import { IntlInputPhoneModule } from 'intl-input-phone';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ChangePasswordComponent } from './components/change-password/change-password.component';


@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    EditBadgeComponent,
    SentInvitationComponent,
    InvitationListComponent,
    PeacekeeperMainComponent,
    ContactListComponent,
    UploadContactsComponent,
    ChangePasswordComponent

  ],
  imports: [
    CommonModule,
    SharedModule,
    PeacekeeperRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEditorModule,
    EditorModule,
    BsDatepickerModule.forRoot(),
    NgxIntlTelInputModule,
    IntlInputPhoneModule,
    ImageCropperModule,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PeacekeeperModule { }
