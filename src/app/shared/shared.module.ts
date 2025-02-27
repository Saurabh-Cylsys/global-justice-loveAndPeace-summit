import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { SharedRoutingModule } from './shared-routing.module';
import { WebHeaderComponent } from './components/web-header/web-header.component';
import { WebFooterComponent } from './components/web-footer/web-footer.component';
import { LeftPanelComponent } from './components/left-panel/left-panel.component';
import { HeaderImgComponent } from './components/header-img/header-img.component';
@NgModule({
  declarations: [
    WebHeaderComponent,
    WebFooterComponent,
    LeftPanelComponent,
    HeaderImgComponent
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
    HeaderImgComponent
  
  ]
})
export class SharedModule { }