import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { WebHomeComponent } from './Home/web/web-home/web-home.component';

const routes: Routes = [


  // {path:'webhome',component:WebHomeComponent},

  {
    path: '',
    loadChildren: () =>
      import('./Home/web/web.module').then((m) => m.WebModule)
  },
  {
    path: '',
    loadChildren: () =>
      import('./Home/delegate/delegate.module').then((m) => m.DelegateModule)
  },

  {
    path: '',
    loadChildren: () =>
      import('./Home/web/web.module').then((m) => m.WebModule)
  },
  // {
  //   path: '',
  //   loadChildren: () =>
  //     import('./shared/shared.module').then((m) => m.SharedModule)
  // },

  // { path: '**', redirectTo: '/web', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled', // Restores scroll position
    anchorScrolling: 'enabled', 
    onSameUrlNavigation: 'reload'       // Enables fragment scrolling
  }),],
  exports: [RouterModule]
})
export class AppRoutingModule { }