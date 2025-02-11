import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiEndpointsService } from 'src/app/core/services/api-endpoints.service';
import { ApiHttpService } from 'src/app/core/services/api-http.service';

@Injectable({
  providedIn: 'root'
})
export class PeacekeeperService {

  constructor(private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService,
    private _toastr: ToastrService) { }



  postPeacekeeperLogin(body:any){
    return this._apiHttpService.post(this._apiEndpointsService.postpeackeeperLoginEndpoint(), body)

  }

  getAllCountrycode() {
    return this._apiHttpService.get(this._apiEndpointsService.getAllCountrycodeEndpoint());
  }

  getPeacekeeperBadgeById(body:any) {
    return this._apiHttpService.post(this._apiEndpointsService.getPeacekeeperBadgeByIdEndpoint(), body);
  }

  updatePeacekeeper(data: any) {
    return this._apiHttpService.put(this._apiEndpointsService.updatePeacekeeperEndpoint(), data
    )
  }

  sendOTPApi(body: any){
    return this._apiHttpService.post(this._apiEndpointsService.getSendOTPEndpoint(),body);
  }

  verifyOTPApi(body: any){
    return this._apiHttpService.post(this._apiEndpointsService.getVerifyOTPEndpoint(),body);
  }

  generatePasswordApi(body:any){
    return this._apiHttpService.post(this._apiEndpointsService.generatePassword(), body)

  }
}
