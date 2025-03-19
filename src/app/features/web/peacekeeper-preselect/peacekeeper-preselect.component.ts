import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DelegateService } from '../../delegate/services/delegate.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-peacekeeper-preselect',
  templateUrl: './peacekeeper-preselect.component.html',
  styleUrls: ['./peacekeeper-preselect.component.css'],
})
export class PeacekeeperPreselectComponent {
  referralCode: string = '';
  mediumValue: string | null = '';
  packageAmt: number = 2800;
  onlinepackageAmt: number = 280;
  onlineDiscount: any;
  childNominationDiscount: any;
  offlineDiscount: any;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private delegateService: DelegateService,
              private sharedService : SharedService,
              private ngxLoader:NgxUiLoaderService) { }

  ngOnInit() {

      this.route.queryParams.subscribe(async (params: any) => {

        if (params != undefined && Object.keys(params).length > 0) {
          this.referralCode = params.code || null; ;
          if (params.medium == 1 && params.code) {

            if (this.referralCode) {
              await this.fnValidateCoupon(this.referralCode);

            }
            this.router.navigate(['/delegate-registration'], {
              queryParams: this.referralCode ? { code: this.referralCode } : {}, // Pass query params
              queryParamsHandling: 'merge', // Preserve existing query params (optional)
              relativeTo: this.route, // Stay on the same route
            })
          }

          else if (!params.medium) {
            console.log('Medium value not found, redirecting...');
            if (this.referralCode) {
              await this.fnValidateCoupon(this.referralCode);
            }
            this.router.navigate(['/peacekeeper-preselect'], {
              queryParams: this.referralCode ? { code: this.referralCode } : {},
            });
          }
        }

        else {
          await this.fnValidateCoupon(0);
        }
      });
  }

  async fnValidateCoupon(referalCode: string | any) {

    this.ngxLoader.start();
    await this.sharedService.getDiscountAmountByCouponCode(referalCode).subscribe({
      next: (response: any) => {

        this.ngxLoader.stop();
        if(response && response.success) {
          response.data.forEach((item:any) => {
            if (item.p_type === "DELEGATE_ONLINE") {
              this.onlineDiscount = item.discount_amount;
            } else if (item.p_type === "DELEGATE_CHILD_NOMINATION") {
              this.childNominationDiscount = item.discount_amount;
            } else if (item.p_type === "DELEGATE_OFFLINE") {
              this.offlineDiscount = item.discount_amount;
            }
          });
        }
      },
      error: (error: any) => {
        console.log("Eror",error);
      }
    });
  }

  goToDelegatePage() {

    if (this.referralCode) {
      this.router.navigate(['/delegate-online'], {
        queryParams: { dType: 'offline', code: this.referralCode, medium: 0 }
      });
    }
    else {
      this.router.navigate(['/delegate-online'], {
        queryParams: { dType: 'offline' }
      });
    }
  }

  goToChildNomination() {

    this.router.navigate(['/delegate-student'], {
      queryParams: { dType: 'offline', code: this.referralCode }
    });
  }

  goToOnlineDelegate() {
    if (this.referralCode) {
      this.router.navigate(['/delegate-online'], {
        queryParams: { dType: 'online', code: this.referralCode }
      });
    }
    else {
      this.router.navigate(['/delegate-online'], {
        queryParams: { dType: 'online' }
      });
    }
  }
}
