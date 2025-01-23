import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebHomeComponent } from './web-home/web-home.component';
import { AgendaPharmaPreconnectComponent } from './agenda-pharma-preconnect/agenda-pharma-preconnect.component';
import { FaqsComponent } from './faqs/faqs.component';
import { OurLengcyComponent } from './our-lengcy/our-lengcy.component';
import { PhotosComponent } from './photos/photos.component';
import { MediaPartnersComponent } from './media-partners/media-partners.component';
import { JoinOurmailingListComponent } from './join-ourmailing-list/join-ourmailing-list.component';
import { SpeakerComponent } from './speaker/speaker.component';
import { SpeakerPostComponent } from './speaker-post/speaker-post.component';
import { EventPartnersComponent } from './event-partners/event-partners.component';
import { DownloadCenterComponent } from './download-center/download-center.component';
import { WebMainComponent } from './web-main/web-main.component';
import { WhoShouldAttendComponent } from './who-should-attend/who-should-attend.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { BrochureComponent } from './brochure/brochure.component';
import { SalesBrochureComponent } from './sales-brochure/sales-brochure.component';
import { AgendaComponent } from './agenda/agenda.component';
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
import { ChairmanCornerComponent } from './chairman-corner/chairman-corner.component';
import { DownloadBrochureComponent } from './download-brochure/download-brochure.component';
import { PaymentMainComponent } from './payment-main/payment-main.component';
import { SuccessComponent } from './success/success.component';
import { PaymentComponent } from './payment/payment.component';

const routes: Routes = [
  {
    path: '',
    component: WebMainComponent,

    children:[
      { path: 'home', redirectTo: '', pathMatch: 'full' }, // Redirect /home to /
 
      { path: '', component: WebHomeComponent, data: { metaKey: 'home' } },
      // {path:'home',component:WebHomeComponent,
      //   data: {
      //     metaKey: 'home'
      //   },
      // },
      // { path: 'AgendaPharma', component: AgendaPharmaPreconnectComponent },
      // { path: 'Faqs', component: FaqsComponent },
      // { path: 'OurLengcy', component: OurLengcyComponent },
      { path: 'DownloadCenter', component: DownloadCenterComponent,
        data: {
          metaKey: 'DownloadCenter'
        },
       },
      // { path: 'EventPartners', component: EventPartnersComponent },
      // { path: 'pastspeakers', component: SpeakerPostComponent },
      // { path: 'speaker', component: SpeakerComponent },
      // { path: 'MediaPartners', component: MediaPartnersComponent },
      // { path: 'WhoShouldAttend', component: WhoShouldAttendComponent },
      // { path: 'aboutUs', component: AboutUsComponent },
      // { path: 'Brochure', component: BrochureComponent },
      // { path: 'salesbrochure', component: SalesBrochureComponent },
      // {path:'Photos',component:PhotosComponent},
      // {path:'JoinOurmailingList',component:JoinOurmailingListComponent},

      // {path:'agenda',component:AgendaComponent},
      {path:'awards',component:AwardsComponent,
        data: {
          metaKey: 'awards'
        },
      },

      // summit url
      {path:'the-summit',component:TheSummitComponent,
        data: {
          metaKey: 'the-summit'
        },
      },
      {path:'partners',component:PartnersComponent,
        data: {
          metaKey: 'partners'
        },
      },
      {path:'world-peacekeepers-movement',component:WorldPeacekeepersMovementComponent,
        data: {
          metaKey: 'world-peacekeepers-movement'
        },
      },
      {path:'contact-us',component:ContactUsComponent,
        data: {
          metaKey: 'contact-us'
        },
      },
      //footer

      {path:'privacy-policy',component:PrivacyPolicyComponent,
        data: {
          metaKey: 'privacy-policy'
        },
      },
      {path:'accessibility',component:AccessibilityComponent,
        data: {
          metaKey: 'accessibility'
        },
      },
      {path:'cookie-policy',component:CookiePolicyComponent,
        data: {
          metaKey: 'cookie-policy'
        },
      },
      {path:'terms-of-use',component:TermsOfUseComponent,
        data: {
          metaKey: 'terms-of-use'
        },
      },
      {path:'visitor-terms-conditions',component:VisitorTermsOnditionsComponent,
        data: {
          metaKey: 'visitor-terms-conditions'
        },
      },
      {path:'chairman-corner',component:ChairmanCornerComponent,
        data: {
          metaKey: 'chairman-corner'
        },
      },
      {path:'download-brochure',component:DownloadBrochureComponent},

      //Payment


      {path:'', redirectTo:'home', pathMatch:'full'}
    ]
  },
  {
    path: '',
    component: PaymentMainComponent,
    children:[
      { path: 'payment-status', component: PaymentComponent },
      { path: 'success', component: SuccessComponent },

    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebRoutingModule { }
