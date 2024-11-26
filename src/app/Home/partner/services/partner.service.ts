import { Injectable } from '@angular/core';
import { ApiEndpointsService } from "src/app/core/services/api-endpoints.service";
import { ApiHttpService } from "src/app/core/services/api-http.service";

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  constructor( private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService,) { }


  // addpartner(data:any) {
  //   return this._apiHttpService.post(this._apiEndpointsService.addpartnerEndpoint(),data
  //   )
  // }



}
