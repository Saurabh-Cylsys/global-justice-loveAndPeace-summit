import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class Constants {

    public readonly API_ENDPOINT: string = environment.apiUrl;
    public readonly API_MOCK_ENDPOINT: string = environment.apiMockUrl;
    public readonly API_IS_DEVELOPMENT_ENV: boolean = environment.production;


    public readonly API_ENDPOINT_registration: string = 'registration/create'
    public readonly API_ENDPOINT_checkEmailAndMobile: string = 'registration/delegate/already'
    public readonly API_ENDPOINT_checkEmailAndMobile_1: string = 'registration/partner/already'
    public readonly API_ENDPOINT_checkEmailAndMobile_2: string = 'registration/speaker/already'

    public readonly API_ENDPOINT_ScannedBadge: string = 'registration/scanned_badge'
    public readonly API_ENDPOINT_user_badge: string = 'registration/user_badge'

    public readonly API_ENDPOINT_registratiotjoin: string = 'subscriber/create'
    public readonly API_ENDPOINT_addbrochure: string = 'brochure/create'
    public readonly API_ENDPOINT_sales_brochure: string = 'sales_brochure/create'


    public readonly API_ENDPOINT_captcha: string = 'captcha'
    public readonly API_ENDPOINT_getDelegate: string = 'registration/delegate/non-registered'
    public readonly API_ENDPOINT_getPartner: string = 'registration/partner/non-registered'
    public readonly API_ENDPOINT_getSpeaker: string = 'registration/speaker/non-registered'

    public readonly API_ENDPOINT_getApprovedDelegate: string = 'registration/delegate/approved'
    public readonly API_ENDPOINT_getApprovedPartner: string = 'registration/partner/approved'
    public readonly API_ENDPOINT_getApprovedSpeaker: string = 'registration/speaker/approved'

    public readonly API_ENDPOINT_approveRegisration: string = 'registration/approve'

    public readonly API_ENDPOINT_unapproveRegisration: string = 'registration/unapprove'
 
    public readonly API_ENDPOINT_getdates:string = 'getDates'
    public readonly API_ENDPOINT_GET_getAllCountrycode:string = 'getAll/countrycode'
    public readonly API_ENDPOINT_GET_ALL_COUNTRY:string = 'getcountry'
    public readonly API_ENDPOINT_GET_ALL_STATES:string = 'getstate'
    public readonly API_ENDPOINT_GET_ALL_CITIES:string = 'getcity'
    public readonly API_ENDPOINT_Download_Badge: string = 'registration/download_badge'

}