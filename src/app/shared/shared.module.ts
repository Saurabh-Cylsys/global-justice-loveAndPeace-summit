import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { SharedRoutingModule } from './shared-routing.module';
import { WebHeaderComponent } from './components/web-header/web-header.component';
import { WebFooterComponent } from './components/web-footer/web-footer.component';
import { LeftPanelComponent } from './components/left-panel/left-panel.component';
import { HeaderImgComponent } from './components/header-img/header-img.component';
import { PeacekeeperHeaderComponent } from './components/peacekeeper-header/peacekeeper-header.component';
import { PeacekeeperLeftpanelComponent } from './components/peacekeeper-leftpanel/peacekeeper-leftpanel.component';
// import { CustomePipePipe } from './classes/custome-pipe.pipe';
@NgModule({
  declarations: [
    WebHeaderComponent,
    WebFooterComponent,
    LeftPanelComponent,
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
    WebHeaderComponent,
    WebFooterComponent,
    LeftPanelComponent,
    HeaderImgComponent,
    PeacekeeperHeaderComponent,
    PeacekeeperLeftpanelComponent
    

  ]
})
export class SharedModule { }
