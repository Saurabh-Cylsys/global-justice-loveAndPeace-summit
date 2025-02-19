import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { AuthModule } from './features/auth/auth.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Constants } from './config/constant';
import { HttpClientModule } from '@angular/common/http';
import { QRCodeModule } from 'angularx-qrcode';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxEditorModule } from 'ngx-editor';
import { ServiceWorkerModule } from '@angular/service-worker';


// import { HeaderComponent } from './shared/components/header/header.component';
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    BrowserModule,
    ToastrModule.forRoot(),
    NgxUiLoaderModule,
    AppRoutingModule,
    FormsModule, ReactiveFormsModule,
    QRCodeModule,
    BsDatepickerModule.forRoot(),
    NgxEditorModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],

  providers: [
    DatePipe,
    Constants,

    provideAnimations(),
    Constants,
    // {provide: LocationStrategy, useClass: HashLocationStrategy}

  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
