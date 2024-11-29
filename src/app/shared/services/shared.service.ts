import { Injectable } from '@angular/core';
import { ApiEndpointsService } from 'src/app/core/services/api-endpoints.service';
import { ApiHttpService } from 'src/app/core/services/api-http.service';
import { Observable, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  apiUrl: any = environment.apiUrl;
  headerIcon: any = '';
  permissionData: any;

  private refreshPermissionSubject = new Subject<boolean>();
  refresh$ = this.refreshPermissionSubject.asObservable();


  constructor(
    private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService,
    private _toastr: ToastrService
  ) { }
  ToastPopup(errorMsg: string, errorModule: string, errorType: string) {
    switch (errorType) {
      case 'error':
        this._toastr.error(errorMsg, errorModule, {
          progressBar: true,
        });

        break;

      case 'info':
        this._toastr.info(errorMsg, errorModule, {
          progressBar: true,
        });

        break;

      case 'success':
        this._toastr.success(errorMsg, errorModule, {
          progressBar: true,
        });

        break;
    }
  }


  registration(data: any) {
    return this._apiHttpService.post(this._apiEndpointsService.registrationEndpoint(), data
    )
  }
  contectUs(data: any) {
    return this._apiHttpService.post(this._apiEndpointsService.contectUsEndpoint(), data
    )
  }

  postPeacekeeper(data: any) {
    return this._apiHttpService.post(this._apiEndpointsService.peacekeeperEndpoint(), data
    )
  }

  capchaa() {
    return this._apiHttpService.get(this._apiEndpointsService.captchaEndpoint()
    )
  }


  registratiotjoin(data: any) {
    return this._apiHttpService.post(this._apiEndpointsService.registratiotjoinEndpoint(), data
    )
  }
  addbrochure(data: any) {
    return this._apiHttpService.post(this._apiEndpointsService.addbrochureEndpoint(), data
    )
  }

  brochure(data: any) {
    return this._apiHttpService.post(this._apiEndpointsService.sales_brochureEndpoint(), data
    )
  }

}
