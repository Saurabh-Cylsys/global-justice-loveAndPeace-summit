import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DelegateMainComponent } from './components/delegate-main/delegate-main.component';
import { DelegateRegistrationComponent } from './components/delegate-registration/delegate-registration.component';
import { DelegateWithChildComponent } from './components/delegate-with-child/delegate-with-child.component';
import { DelegateOnlineComponent } from './components/delegate-online/delegate-online.component';
import { DelegateRegistrationSeoComponent } from './components/delegate-registration-seo/delegate-registration-seo.component';
const routes: Routes = [
  {
    path: '',
    component: DelegateMainComponent,

    children:[
      {path:'delegate-registration',component:DelegateRegistrationComponent},
      {path:'delegate-child-nomination',component:DelegateWithChildComponent},
      {path:'delegate-online',component:DelegateOnlineComponent},
      {path:'delegate-ad',component:DelegateRegistrationSeoComponent},
      {path:'', redirectTo:'/delegate-registration', pathMatch:'full'}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DelegateRoutingModule { }
