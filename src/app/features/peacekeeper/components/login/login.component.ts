import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PeacekeeperService } from '../../services/peacekeeper.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  emailForm!: FormGroup;

  constructor(private router:Router,
              private fb: FormBuilder,
              private peaceKeeperService : PeacekeeperService,
              private sharedService: SharedService,
              private ngxService: NgxUiLoaderService,){}

  ngOnInit(){
    this.createLoginForm();

  }

  createLoginForm(){
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  login(){

    let encryptedEmail = this.sharedService.encryptData({
      "email": this.emailForm.value.email
    });

    let body = {
      "encrypted_data": encryptedEmail
    };

    this.ngxService.start();
    this.peaceKeeperService.postPeacekeeperLogin(body).subscribe({
      next : (res:any)=>{
        console.log("Res",res);
        if(res.success) {
          this.sharedService.ToastPopup('Login Successful','','success')
          const decreptedToken = this.sharedService.decryptData(res.token);
          const decreptedUser  = this.sharedService.decryptData(res.data)

          // Store the encrypted token
          this.sharedService.setJWTToken(decreptedToken);
          this.sharedService.setUserDetails(JSON.stringify(decreptedUser));
          this.ngxService.stop();

          this.router.navigate(['/dashboard']);
        }

      }
    })

  }
}
