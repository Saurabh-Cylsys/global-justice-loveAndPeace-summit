import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PeacekeeperMainComponent } from './components/peacekeeper-main/peacekeeper-main.component';
import { EditBadgeComponent } from './components/edit-badge/edit-badge.component';
import { InvitationListComponent } from './components/invitation-list/invitation-list.component';
import { SentInvitationComponent } from './components/sent-invitation/sent-invitation.component';
import { ContactListComponent } from './components/contact-list/contact-list.component';
import { UploadContactsComponent } from './components/upload-contacts/upload-contacts.component';

const routes: Routes = [

  {
    path: '',
    component: PeacekeeperMainComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'edit-badge', component: EditBadgeComponent },
      { path: 'invitation-List', component: InvitationListComponent },
      { path: 'sent-invitation', component: SentInvitationComponent },
      { path: 'contact-list', component: ContactListComponent },
      { path: 'upload-contacts', component: UploadContactsComponent }
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeacekeeperRoutingModule { }
