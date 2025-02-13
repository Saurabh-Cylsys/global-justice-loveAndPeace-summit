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
  ipAddress: string = "";
  deviceInfo: any = "";
  isOTPReceive: boolean = false;
  txtVerifyOTP : string = ""
  countdown: number = 60; // 5 minutes in seconds
  timerExpired: boolean = false;
  interval: any;
  buttonText :string = 'Login with OTP'

  constructor(private router: Router,
    private fb: FormBuilder,
    private peaceKeeperService: PeacekeeperService,
    private sharedService: SharedService,
    private ngxService: NgxUiLoaderService,) { }

  ngOnInit(){
    localStorage.clear();
    sessionStorage.clear();
    this.createLoginForm();

    this.getIPAddress();

    this.deviceInfo = this.getDeviceOS();

  }

  createLoginForm() {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password : ['',[Validators.required]]
    });
  }

  get password() {
    return this.emailForm.get('password');
  }

  getIPAddress(){
    this.sharedService.getIPAddress().subscribe({
      next :(res:any)=>{
        this.ipAddress = res.ip;
      }
    })
  }

  getDeviceOS(): string {
    const userAgent = navigator.userAgent;
    if (/android/i.test(userAgent)) return 'Android';
    if (/iPad|iPhone|iPod/.test(userAgent)) return 'iOS';
    if (/Win/i.test(userAgent)) return 'Windows';
    if (/Mac/i.test(userAgent)) return 'MacOS';
    if (/Linux/i.test(userAgent)) return 'Linux';
    return 'Unknown';
  }

  startTimer() {
    if (this.interval) {
      clearInterval(this.interval); // Clear any existing timer
    }

    this.timerExpired =false;
    this.countdown = 60; // Reset countdown to 100 seconds
    this.buttonText = "Resend OTP";

    this.interval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.timerExpired = true;
        this.buttonText = "Resend OTP";
        clearInterval(this.interval); // Stop the timer when it reaches 0
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval); // Clear timer when component is destroyed
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  sendOTP(){

    if(this.emailForm.value.email == "" || this.emailForm.value.email == undefined) {
      // this.renderer.selectRootElement('#email').focus();
      this.sharedService.ToastPopup("Please Enter Email ID",'','error');
      return;
    }
    else if (this.emailForm.controls['email'].invalid) {
      // this.renderer.selectRootElement('#email').focus();
      this.sharedService.ToastPopup('Please enter a valid Email ID', '', 'error');
      return;
    }

    let body = {
      "email": this.emailForm.value.email,
      "deviceId": this.ipAddress,
      "deviceOs": this.deviceInfo,
      "registeration_type":"1"
    }
    this.ngxService.start();
    this.peaceKeeperService.sendOTPApi(body).subscribe({
      next :(res:any)=>{
        console.log("Res",res);
        this.ngxService.stop();
        this.isOTPReceive = true;
        this.timerExpired = false;
        this.countdown = 60; // Reset countdown
        this.startTimer();
        this.emailForm.value.password = "";
        this.sharedService.ToastPopup(res.message,'','success')
      },
      error: (err: any) => {
        console.error("Error:", err);
        this.ngxService.stop();
      }
    })
  }

  verifyOTP(){

    if(this.emailForm.value.email == "" || this.emailForm.value.email == undefined) {
      // this.renderer.selectRootElement('#email').focus();
      this.sharedService.ToastPopup("Please Enter Email ID",'','error');
      return;
    }
    else if (this.emailForm.controls['email'].invalid) {
      // this.renderer.selectRootElement('#email').focus();
      this.sharedService.ToastPopup('Please enter a valid Email ID', '', 'error');
      return;
    }
    else if (!this.txtVerifyOTP) {
      // this.renderer.selectRootElement('#email').focus();
      this.sharedService.ToastPopup('Please enter OTP', '', 'error');
      return;
    }


    let body = {
      "email": this.emailForm.value.email,
      "otp": this.txtVerifyOTP,
      "deviceId": this.ipAddress,
      "os_type": this.deviceInfo,
      "password": "",
      "loginVia": "0",// for otp
    }

    this.peaceKeeperService.postPeacekeeperLogin(body).subscribe({
      next :(res:any)=>{
        console.log("Res",res);

        if (res.success) {
          // this.sharedService.ToastPopup('Login Successful', '', 'success')

          const userData = {
            full_name : res.data['full_name'],
            peacekeeper_id : res.data['peacekeeper_id'],
            file_name : res.data['file_name'],
            qr_code : res.data['QR_CODE'],
            email :res.data['email_id']
          }

          this.buttonText = "Send OTP";
          this.isOTPReceive = false;
          this.timerExpired = false;
          this.sharedService.ToastPopup('Login Successful','','success');
          this.sharedService.setJWTToken(res.token);
          this.peaceKeeperService.setToken('authToken');
          this.sharedService.setUserDetails(JSON.stringify(userData));
          this.ngxService.stop();
          this.emailForm.reset();
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err: any) => {
        console.error("Error:", err);
        this.ngxService.stop();
      }
    })
  }


  login() {

    // let encryptedData = this.sharedService.encryptData({
    //   "email": this.emailForm.value.email,
    //   "password" : this.emailForm.value.password
    // });

    // let body = {
    //   "encrypted_data": encryptedData
    // };

    let body = {
      "email": this.emailForm.value.email,
      "password" : this.emailForm.value.password,
      "deviceId": this.ipAddress,
      "os_type": this.deviceInfo,
      "loginVia": "1",// for password
      "otp":""
    }

    this.ngxService.start();
    this.peaceKeeperService.postPeacekeeperLogin(body).subscribe({
      next: (res: any) => {
        console.log("Res", res);
        if (res.success) {
          this.sharedService.ToastPopup('Login Successful', '', 'success')
          // const decreptedToken = this.sharedService.decryptData(res.token);
          // const decreptedUser = this.sharedService.decryptData(res.data)
          const userData = {
            full_name : res.data['full_name'],
            peacekeeper_id : res.data['peacekeeper_id'],
            file_name : res.data['file_name'],
          }
          // Store the encrypted token
          debugger;
          console.log("Userdata",userData);
          this.sharedService.setJWTToken(res.token);
          this.peaceKeeperService.setToken('authToken');
          this.sharedService.setUserDetails(JSON.stringify(userData));
          this.ngxService.stop();
          this.emailForm.reset();
          this.router.navigate(['/dashboard']);
        }

      },
      error : (err)=>{
        console.log(err.error);
        this.sharedService.ToastPopup(err.error['message'],'','error');
        this.ngxService.stop();
      }
    })
  }

  validateEmail(event: any) {
    let value = event.target.value;

    // Remove leading spaces and spaces inside the email
    event.target.value = value.replace(/\s+/g, '');
  }

}
