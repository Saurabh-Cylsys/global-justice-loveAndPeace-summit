import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/peacekeeper/peacekeeper.module').then((m) => m.PeacekeeperModule)
  },
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
