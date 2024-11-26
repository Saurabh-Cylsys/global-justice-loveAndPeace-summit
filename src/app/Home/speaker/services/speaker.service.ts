import { Injectable } from '@angular/core';
import { ApiEndpointsService } from "src/app/core/services/api-endpoints.service";
import { ApiHttpService } from "src/app/core/services/api-http.service";

@Injectable({
  providedIn: 'root'
})
export class SpeakerService {

  constructor(  private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService,) { }


  
  checkEmailAndMobile(data:any) {
    return this._apiHttpService.post(this._apiEndpointsService.checkEmailAndMobileEndpoint(),data
    )
  }
  ScannedBadge(data:any) {
    return this._apiHttpService.post(this._apiEndpointsService.ScannedBadge(),data
    )
  }
  user_badge(data:any) {
    return this._apiHttpService.post(this._apiEndpointsService.user_badge(),data
    )
  }
    
  checkEmailAndMobile_1(data:any) {
    return this._apiHttpService.post(this._apiEndpointsService.checkEmailAndMobile_1Endpoint(),data
    )
  }

    
  checkEmailAndMobile_2(data:any) {
    return this._apiHttpService.post(this._apiEndpointsService.checkEmailAndMobile_2Endpoint(),data
    )
  }
  Download_Badge(body: any) {
    return this._apiHttpService.post(this._apiEndpointsService.Download_Badge(), body, { responseType: 'blob' });
  }
}
