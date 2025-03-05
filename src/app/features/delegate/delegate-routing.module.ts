import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DelegateMainComponent } from './components/delegate-main/delegate-main.component';
import { DelegateRegistrationComponent } from './components/delegate-registration/delegate-registration.component';
import { DelegateWithChildComponent } from './components/delegate-with-child/delegate-with-child.component';
import { DelegateOnlineComponent } from './components/delegate-online/delegate-online.component';
import { DelegateRegistrationSeoComponent } from './components/delegate-registration-seo/delegate-registration-seo.component';
import { DelegateRegistrationOnlineComponent } from './components/delegate-registration-online/delegate-registration-online.component';
import { DelegatePeaceStudentComponent } from './components/delegate-peace-student/delegate-peace-student.component';
import { DelegateMessageComponent } from './components/delegate-message/delegate-message.component';
const routes: Routes = [
  {
    path: '',
    component: DelegateMainComponent,

    children:[
      {path:'delegate-registration',component:DelegateRegistrationComponent},
      {path:'delegate-child-nomination',component:DelegateWithChildComponent},
      {path:'delegate-online',component:DelegateOnlineComponent},
      {path:'delegate-ad',component:DelegateRegistrationSeoComponent},
      {path:'delegate-registration-online',component:DelegateRegistrationOnlineComponent},
      {path:'delegate-student',component:DelegatePeaceStudentComponent},
      {path:'delegate-message',component:DelegateMessageComponent},
      {path:'', redirectTo:'/delegate-registration', pathMatch:'full'}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DelegateRoutingModule { }
