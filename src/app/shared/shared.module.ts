import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { SharedRoutingModule } from './shared-routing.module';
import { HeaderImgComponent } from './components/header-img/header-img.component';
import { PeacekeeperHeaderComponent } from './components/peacekeeper-header/peacekeeper-header.component';
import { PeacekeeperLeftpanelComponent } from './components/peacekeeper-leftpanel/peacekeeper-leftpanel.component';
// import { CustomePipePipe } from './classes/custome-pipe.pipe';
@NgModule({
  declarations: [
    HeaderImgComponent,
    PeacekeeperHeaderComponent,
    PeacekeeperLeftpanelComponent,
    // CustomePipePipe
  ],
  imports: [
    CommonModule,
    ToastrModule,
    SharedRoutingModule
  ],
  exports:[
    HeaderImgComponent,
    PeacekeeperHeaderComponent,
    PeacekeeperLeftpanelComponent


  ]
})
export class SharedModule { }
