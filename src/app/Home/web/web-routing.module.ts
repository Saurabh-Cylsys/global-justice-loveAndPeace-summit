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
      {path:'home',component:WebHomeComponent,
        data: {
          title: 'Global Justice, Love and Peace Summit | Dubai',
          description: 'Join the Global Justice, Love, and Peace Summit in Dubai, a transformative event uniting leaders, activists, and visionaries to promote equality, compassion, and harmony worldwide. Be part of the change!',
        },
      },
      // { path: 'AgendaPharma', component: AgendaPharmaPreconnectComponent },
      // { path: 'Faqs', component: FaqsComponent },
      // { path: 'OurLengcy', component: OurLengcyComponent },
      { path: 'DownloadCenter', component: DownloadCenterComponent,
        data: {
          title: 'Download Center | Global Justice, Love, and Peace Summit 2025',
          description: 'Access essential resources, materials, and documents related to the Justice, Love, and Peace Movement. Download brochures, event details, and more to stay informed and engaged with our global initiatives.',
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
          title: 'Awards | Global Justice, Love, and Peace Movement | Dubai',
          description: 'Explore the prestigious awards conferred by the Justice, Love, and Peace Movement through a non-biased, merit-based process conducted by a 28-member global committee across 23 countries. Honoring individuals from all professions who have made a significant impact on society.',
        },
      },

      // summit url
      {path:'the-summit',component:TheSummitComponent,
        data: {
          title: 'The Summit | Global Justice, Love, and Peace Movement | Dubai',
          description: 'Explore the Global Justice, Love, and Peace Summit, a platform for collaboration and dialogue to build a fairer, more compassionate world. Learn more about the event and join us in driving positive change.',
        },
      },
      {path:'partners',component:PartnersComponent,
        data: {
          title: 'Our Partners | Global Justice, Love, and Peace Movement | Dubai',
          description: 'Meet the organizations and individuals collaborating with the Justice, Love, and Peace Movement to promote global harmony and equality. Discover our partners, contributions and join us in fostering a more peaceful world.',
        },
      },
      {path:'world-peacekeepers-movement',component:WorldPeacekeepersMovementComponent,
        data: {
          title: 'World Peacekeepers Movement | Global Justice, Love, and Peace Initiative | Dubai ',
          description: 'Join the World Peacekeepers Movement, a global initiative forming the worlds largest peace army to promote justice, love, and harmony. JOIN US AS A PEACEKEEPER NOW and make a difference in creating a peaceful world.',
        },
      },
      {path:'contact-us',component:ContactUsComponent,
        data: {
          title: 'Contact Us | Justice, Love, and Peace Movement',
          description: 'Reach out to the Justice, Love, and Peace Movement for inquiries, support, or collaboration opportunities. Our dedicated team is here to assist you in promoting global harmony and equality.',
        },
      },
      //footer
      
      {path:'privacy-policy',component:PrivacyPolicyComponent,
        data: {
          title: 'Privacy Policy | Global Justice, Love, and Peace Summit 2025',
          description: 'Review the Privacy Policy for the Global Justice, Love, and Peace Summit 2025 in Dubai. Understand how we collect, use, and protect your personal information to ensure a secure and transparent experience.',
        },
      },
      {path:'accessibility',component:AccessibilityComponent,
        data: {
          title: 'Accessibility Information | Global Justice, Love, and Peace Summit 2025',
          description: 'Learn about the accessibility features of the Global Justice, Love, and Peace Summit 2025 in Dubai. We provide accessible parking, entrances, seating areas, sign language interpretation, Braille materials, and live captioning to ensure an inclusive experience for all attendees.',
        },
      },
      {path:'cookie-policy',component:CookiePolicyComponent,
        data: {
          title: 'Cookie Policy | Global Justice, Love, and Peace Summit 2025',
          description: 'Learn about the use of cookies on the Global Justice, Love, and Peace Summit 2025 website. Understand how we collect and manage your data to enhance your browsing experience.',
        },
      },
      {path:'terms-of-use',component:TermsOfUseComponent,
        data: {
          title: 'Terms of Use | Global Justice, Love, and Peace Summit 2025',
          description: 'Review the Terms of Use for the Global Justice, Love, and Peace Summit 2025 in Dubai. Understand the guidelines and policies to ensure a safe and enjoyable experience at the event.',
        },
      },
      {path:'visitor-terms-conditions',component:VisitorTermsOnditionsComponent,
        data: {
          title: 'Visitor Terms & Conditions | Global Justice, Love, and Peace Summit 2025',
          description: 'Review the Visitor Terms & Conditions for the Global Justice, Love, and Peace Summit 2025 in Dubai. Understand the guidelines and policies to ensure a safe and enjoyable experience at the event.',
        },
      },
      {path:'chairman-corner',component:ChairmanCornerComponent,
        data: {
          title: 'Chairmans Corner | Global Justice, Love, and Peace Summit 2025',
          description: 'Explore insights and messages from the Chairman of the Justice, Love, and Peace Movement, guiding our mission to foster global harmony and equality. Stay informed about leadership perspectives and organizational developments.',
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
