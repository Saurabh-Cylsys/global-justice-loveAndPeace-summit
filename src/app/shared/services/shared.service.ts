import { Injectable } from '@angular/core';
import { ApiEndpointsService } from 'src/app/core/services/api-endpoints.service';
import { ApiHttpService } from 'src/app/core/services/api-http.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NavigationEnd, Router } from '@angular/router';
import CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  apiUrl: any = environment.apiUrl;
  headerIcon: any = '';
  permissionData: any;

  private refreshPermissionSubject = new Subject<boolean>();
  refresh$ = this.refreshPermissionSubject.asObservable();
  isMobileView = new Subject();

  private collapsedState = new BehaviorSubject<boolean>(false);
  isCollapsed$ = this.collapsedState.asObservable();

  //private refreshheader = new BehaviorSubject<boolean>(false);
  private refresHeaderSubject = new Subject<boolean>();
  refreshheader$ = this.refresHeaderSubject.asObservable();

  constructor(
    private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService,
    private _toastr: ToastrService,
    private router: Router
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
  }

  private secretKey = '6b5872594167471930cfe5c0b99cb6bfafd7b1601ee9f439359a7dde010a5ce9'; // Use a secure key & store it safely

  encryptData(data: any): string {
    const jsonString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, this.secretKey).toString();
  }

  decryptData(cipherText: string): any {
    const bytes = CryptoJS.AES.decrypt(cipherText, this.secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

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

  getJWTToken() {
    return localStorage.getItem('res');
  }

  setJWTToken(res: string) {
    sessionStorage.setItem('res', res);
    localStorage.setItem('res', res);
  }

  getUserDetails() {
    return JSON.parse(localStorage.getItem('userDetails') || '{}');
  }

  setUserDetails(userDetails: any) {
    sessionStorage.setItem('userDetails', userDetails);
    localStorage.setItem('userDetails', userDetails);
  }

  toggleSidebar() {
    this.collapsedState.next(!this.collapsedState.value);
  }
  getIPAddress() {
    return this._apiHttpService.get('https://api64.ipify.org?format=json')
  }

  refreshHeader() {
    this.refresHeaderSubject.next(true);
}


}
