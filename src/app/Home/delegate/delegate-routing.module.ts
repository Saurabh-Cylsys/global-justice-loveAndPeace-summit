import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DelegateMainComponent } from './components/delegate-main/delegate-main.component';
import { DelegateRegistrationComponent } from './components/delegate-registration/delegate-registration.component';
const routes: Routes = [
  {
    path: '', 
    component: DelegateMainComponent,

    children:[
      {path:'delegate-registration',component:DelegateRegistrationComponent,
        data: {
          title: 'Delegate Registration | Global Justice, Love, and Peace Summit 2025',
          description: 'Register now to participate as a delegate in the Global Justice, Love, and Peace Summit 2025 in Dubai. Join global leaders and visionaries in promoting equality, justice, and unity. Secure your spot today!',
        },
      },
      
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
