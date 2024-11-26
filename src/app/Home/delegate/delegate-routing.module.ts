import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DelegateMainComponent } from './components/delegate-main/delegate-main.component';
import { DelegateRegistrationComponent } from './components/delegate-registration/delegate-registration.component';
const routes: Routes = [
  {
    path: '', 
    component: DelegateMainComponent,

    children:[
      {path:'delegate-registration',component:DelegateRegistrationComponent},
      
      // {path:'register',component:},
      // {path:'reset-password',component:ResetPasswordComponent},
      {path:'', redirectTo:'/delegate-registration', pathMatch:'full'}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DelegateRoutingModule { }
