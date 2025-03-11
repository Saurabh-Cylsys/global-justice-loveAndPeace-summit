import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { SafePipe } from './pipes/safe.pipe';
import { ToastrModule } from 'ngx-toastr';
import { SharedRoutingModule } from './shared-routing.module';
import { WebHeaderComponent } from './components/web-header/web-header.component';
import { WebFooterComponent } from './components/web-footer/web-footer.component';
import { LeftPanelComponent } from './components/left-panel/left-panel.component';
import { HeaderImgComponent } from './components/header-img/header-img.component';
import { MediaHeaderComponent } from './components/media-header/media-header.component';
// import { CustomePipePipe } from './classes/custome-pipe.pipe';
@NgModule({
  declarations: [
    //SafePipe,
    WebHeaderComponent,
    WebFooterComponent,
    LeftPanelComponent,
    HeaderImgComponent,
    MediaHeaderComponent,
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
    MediaHeaderComponent,

  ]
})
export class SharedModule { }
