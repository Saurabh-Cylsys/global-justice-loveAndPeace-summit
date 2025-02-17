import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WebRoutingModule } from './web-routing.module';
import { WebHomeComponent } from './web-home/web-home.component';
import { DownloadCenterComponent } from './download-center/download-center.component';
import { WebMainComponent } from './web-main/web-main.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AwardsComponent } from './awards/awards.component';
import { TheSummitComponent } from './the-summit/the-summit.component';
import { PartnersComponent } from './partners/partners.component';
import { WorldPeacekeepersMovementComponent } from './world-peacekeepers-movement/world-peacekeepers-movement.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { AccessibilityComponent } from './accessibility/accessibility.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';
import { VisitorTermsOnditionsComponent } from './visitor-terms-onditions/visitor-terms-onditions.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { IntlInputPhoneModule } from 'intl-input-phone';
import { ChairmanCornerComponent } from './chairman-corner/chairman-corner.component';
import { QRCodeModule } from 'angularx-qrcode';
import { DownloadBrochureComponent } from './download-brochure/download-brochure.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { PaymentMainComponent } from './payment-main/payment-main.component';
import { PaymentComponent } from './payment/payment.component';
import { SuccessComponent } from './success/success.component';
import { PaymentCancelComponent } from './payment-cancel/payment-cancel.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CustomePipePipe } from 'src/app/shared/classes/custome-pipe.pipe';
import { SwiperModule } from 'swiper/angular';
import { HumanValuesComponent } from './blog/human-values/human-values.component';
import { HowToUseSocialMediaComponent } from './blog/how-to-use-social-media/how-to-use-social-media.component';
import { SitemapComponent } from './sitemap/sitemap.component';
import { DownloadApplicationsComponent } from './download-applications/download-applications.component';
import { PeacekeeperPreselectComponent } from './peacekeeper-preselect/peacekeeper-preselect.component';
import { RequestAccountDeletionsComponent } from './request-account-deletions/request-account-deletions.component';


@NgModule({
  declarations: [
    WebHomeComponent,
    DownloadCenterComponent,
    WebMainComponent,
    AwardsComponent,
    TheSummitComponent,
    PartnersComponent,
    WorldPeacekeepersMovementComponent,
    ContactUsComponent,
    PrivacyPolicyComponent,
    AccessibilityComponent,
    CookiePolicyComponent,
    TermsOfUseComponent,
    VisitorTermsOnditionsComponent,
    ChairmanCornerComponent,
    DownloadBrochureComponent,
    PaymentMainComponent,
    PaymentComponent,
    SuccessComponent,
    PaymentCancelComponent,
    CustomePipePipe,
    HumanValuesComponent,
    HowToUseSocialMediaComponent,
    SitemapComponent,
    DownloadApplicationsComponent,
    PeacekeeperPreselectComponent,
    RequestAccountDeletionsComponent

    // WhoShouldAttendAndWhyComponent,

  ],
  imports: [
    CommonModule,
    WebRoutingModule,
    SharedModule,
    FormsModule,
   ReactiveFormsModule,
    NgxIntlTelInputModule ,
    QRCodeModule,
   IntlInputPhoneModule,
   ImageCropperModule,
   SwiperModule,
   BsDatepickerModule.forRoot()
  ]
})
export class WebModule { }
