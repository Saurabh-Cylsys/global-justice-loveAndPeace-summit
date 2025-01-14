import { Injectable } from '@angular/core';
import { ApiEndpointsService } from "src/app/core/services/api-endpoints.service";
import { ApiHttpService } from "src/app/core/services/api-http.service";



@Injectable({
  providedIn: 'root'
})
export class DelegateService {

  constructor(
    private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService,
    // private translate: TranslateService
  ) { }
  getSpeakers() {
    return this._apiHttpService.get(this._apiEndpointsService.getSpeakersEndpoint());
  }
 
  getdates() {
    return this._apiHttpService.get(this._apiEndpointsService.getdatesEndpoint());
  }
  getAllCountrycode() {
    return this._apiHttpService.get(this._apiEndpointsService.getAllCountrycodeEndpoint());
  }
  getAllCountries() {
    return this._apiHttpService.get(this._apiEndpointsService.getAllCountriesEndpoint());
  }

  getAllStates(country_id: any) {
    return this._apiHttpService.get(this._apiEndpointsService.getAllStatesEndpoint(country_id));
  }

  getAllCities(state_id: any) {
    return this._apiHttpService.get(this._apiEndpointsService.getAllCitiesEndpoint(state_id));

  }

  getPeacekeeper_Badge(id: any) {
    return this._apiHttpService.get(this._apiEndpointsService.getPeacekeeper_Badge_Data(id));

  }

  postCheckoutSession(body: any) {
    return this._apiHttpService.post(this._apiEndpointsService.postCheckoutSessionEndpoint(),body);

  }
  postVerifySession(body: any) {
    return this._apiHttpService.get(this._apiEndpointsService.postVerifySessionEndpoint(),body);

  }
}