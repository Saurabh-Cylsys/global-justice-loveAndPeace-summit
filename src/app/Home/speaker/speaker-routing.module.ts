import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpeakerMainComponent } from './components/speaker-main/speaker-main.component';
import { SpeakerRegistrationComponent } from './components/speaker-registration/speaker-registration.component';
import { FirstRagistratComponent } from './first-ragistrat/first-ragistrat.component';
import { FirstSpeekarComponent } from './first-speekar/first-speekar.component';
import { FirstPartnerComponent } from './first-partner/first-partner.component';

const routes: Routes = [
  {
    path: '', 
    component: SpeakerMainComponent,

    children:[
      {path:'speaker-registration',component:SpeakerRegistrationComponent},
      // {path:'register',component:},
      {path:'delegate',component:FirstRagistratComponent},

      {path:'speakar',component:FirstSpeekarComponent},

      {path:'partner',component:FirstPartnerComponent},
       {path:'', redirectTo:'/speaker-registration', pathMatch:'full'}
    ]
  }



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpeakerRoutingModule { }
