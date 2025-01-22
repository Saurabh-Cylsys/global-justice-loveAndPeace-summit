import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartnerMainComponent } from './components/partner-main/partner-main.component';
import { PartnerRegistrationComponent } from './components/partner-registration/partner-registration.component';

const routes: Routes = [

  {
    path: '',
    component: PartnerMainComponent,

    children:[
      {path:'partner-registration',component:PartnerRegistrationComponent,
      },
      // {path:'register',component:},
      // {path:'reset-password',component:ResetPasswordComponent},
      {path:'', redirectTo:'/partner-registration', pathMatch:'full'}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnerRoutingModule { }
