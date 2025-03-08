import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { DelegateService } from '../../services/delegate.service';
import { DatePipe } from '@angular/common';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-delegate-peace-student',
  templateUrl: './delegate-peace-student.component.html',
  styleUrls: ['./delegate-peace-student.component.css'],

})
export class DelegatePeaceStudentComponent {
  userType: 'student' | 'delegate' | null = null; // Tracks user selection
  step: number = 1; // Tracks the current step
  studentForm!: FormGroup;
  delegateForm!: FormGroup;
  studentMobileNumberVal: boolean = false;
  deleagetMobileNumberVal: boolean = false;
  countryData: any = [];

  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  selectedCountryISO: any;
  SearchCountryField = SearchCountryField;
  maxDate: any;
  minDate: any;
  formattedDate: string = '';
  colorTheme: string = 'theme-dark-blue';
  delegateAge: number = 0;
  StudentAge: number = 0;
  studentDob: string = '';
  delegateDob: string = '';
  nomineeFormattedDate: string = "";
  nominee_mobile_number: any;
  delegateId: any;

  minStudentDate!: Date;
  maxStudentDate!: Date;
  minDelegateDate!: Date;
  maxDelegateDate!: Date;
  referralCode: any = "";
  delagateType: any;

  constructor(private fb: FormBuilder,
    private delegateService: DelegateService,
    private datePipe: DatePipe,
    private sharedService:SharedService,
    private route: ActivatedRoute,) {

    this.route.queryParams.subscribe((params: any) => {
      if (params != undefined && Object.keys(params).length > 0) {
        debugger;
        this.referralCode = params.code;

        console.log('params', params);
        this.delagateType = params.dType;

        // this.router.navigate([], {
        //   relativeTo: this.route,
        //   queryParams: { '': 'rakesh.gupta.pc' }, // Customize the URL
        //   replaceUrl: true // Replace the current URL in the browser history
        // });
      }
    });



    const today = new Date();

    // Student: Age between 1 to 21 years
    this.maxStudentDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()); // 1 year old
    this.minStudentDate = new Date(today.getFullYear() - 21, today.getMonth(), today.getDate()); // 21 years old

    // Delegate: Must be strictly older than 21 years

    this.maxDelegateDate = new Date(
      today.getFullYear() - 21,
      today.getMonth(),
      today.getDate()
    );

    // Min date is 120 years ago from today
    this.minDelegateDate = new Date(today.getFullYear() - 120, 0, 1);

  }

  ngOnInit(){

    this.initializeStudentForm();
    this.initializeDelegateForm();

    this.getAllCountries();

  }

  initializeStudentForm() {
     // Initialize student form
     this.studentForm = this.fb.group({
      title: ['',[Validators.required, Validators.minLength(2)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      studentDob :['', [Validators.required]],
      mobile_number: ['', [Validators.minLength(7), Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      country: ['', [Validators.required]],
      institutionName: ['', [Validators.required]],
      relation: ['',[Validators.required]]
    });
  }

  initializeDelegateForm(){
    // Initialize delegate form
    this.delegateForm = this.fb.group({
      title: ['',[Validators.required, Validators.minLength(2)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      mobile_number: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      country: ['', [Validators.required]],
      delegateDob :['', [Validators.required]],
      reference_no: [this.referralCode ? this.referralCode : ''],
    });
  }

  // Set user type and move to the first step
  setUserType(type: 'student' | 'delegate',event: Event) {

    if (this.userType === type) return;

    // if (this.isFormDirty()) {
    //   const confirmed = confirm(
    //     'Warning: Your unsaved data will be lost. Do you want to continue?'
    //   );

    //   if (!confirmed) {

    //     return; // Exit without changing userType
    //   }
    //   this.resetForms();
    // }

    this.userType = type; // Update only after confirmation

  }

  private isFormDirty(): boolean {
    return this.studentForm?.dirty || this.delegateForm?.dirty;
  }

  private resetForms(): void {
    this.initializeStudentForm();
    this.initializeDelegateForm();
    this.studentForm?.reset();
    this.delegateForm?.reset();
  }

  getStudentControl(name: string): AbstractControl | null {
    return this.studentForm.get(name);
  }

  getDelegateControl(name: string): AbstractControl | null {
    return this.delegateForm.get(name);
  }

  disableManualInput(event: KeyboardEvent): void {
    event.preventDefault();
  }

  validateAlpha(event: any) {
    const allowedPattern = /^[a-zA-Z\s\-'_‘]$/;

    if (!allowedPattern.test(event.key)) {
      event.preventDefault(); // Block invalid characters
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault(); // Block pasting
    const text = event.clipboardData?.getData('text') || '';

    // Allow only alphabets and spaces
    const allowedPattern = /^[a-zA-Z\s\-_‘]$/;
    if (allowedPattern.test(text)) {
      const input = event.target as HTMLInputElement;
      input.value += text; // Append only valid text
      input.dispatchEvent(new Event('input')); // Update Angular form control
    }
  }

  onDateChange(event: string): void {
    // Convert the date format
    const parsedDate = new Date(event);
    this.formattedDate =
      this.datePipe.transform(parsedDate, 'yyyy-MM-dd') || '';
  }

  openDatepicker() {
    const dobInput = document.getElementById('dob') as HTMLInputElement;
    if (dobInput) {
      dobInput.click(); // Open ngx-bootstrap datepicker
    }
  }

  openDelageteDatepicker() {
    const dobInput = document.getElementById('delegateDob') as HTMLInputElement;
    if (dobInput) {
      dobInput.click(); // Open ngx-bootstrap datepicker
    }
  }

  keyPressNumbersForStudent(event: KeyboardEvent) {
    const inputValue = this.studentForm.controls['mobile_number'].value; // Get value from form control
    if (inputValue && inputValue.number) {
      if (inputValue.number.length < 7) {
        this.studentMobileNumberVal = true;
      } else {
        this.studentMobileNumberVal = false;
      }
    }
  }

  keyPressNumbersForDelegate(event: KeyboardEvent) {
    const inputValue = this.delegateForm.controls['mobile_number'].value; // Get value from form control
    if (inputValue && inputValue.number) {
      if (inputValue.number.length < 7) {
        this.deleagetMobileNumberVal = true;
      } else {
        this.deleagetMobileNumberVal = false;
      }
    }
  }

  getPhoneErrorMessage() {
    const control = this.studentForm.controls['mobile_number'];
    if (control.value && control.errors) {
      const phoneError = control.errors['validatePhoneNumber']; // Use bracket notation
      if (phoneError?.valid) {
        return '';
      } else {
        return 'Invalid mobile number for selected country.';
      }
    }
    return '';
  }

  getAllCountries() {
    this.delegateService.getAllCountries().subscribe(
      (res: any) => {
        this.countryData = res.data;
      },
      (err: any) => {
        console.log('error', err);
      }
    );
  }

  changeCountry(e: any) {
    const selectedValue = e.target.value;
    console.log('selectedValue', selectedValue);
  }

  // Handle form submission
  onSubmit() {
    if (this.studentForm.valid && this.delegateForm.valid) {
      console.log('Student Form Data:', this.studentForm.value);
      console.log('Delegate Form Data:', this.delegateForm.value);
      this.sharedService.ToastPopup('Please enter required Fields', '', 'error');
      return;
    }
    // Get the full name entered by the user
    const fullName = this.delegateForm.get('name')?.value.trim();

    // Split the full name into parts
    const nameParts = fullName.split(' ');

    // Extract first and last name
    const delegate_firstName = nameParts[0] || ''; // First part as first name
    const delegate_lastName = nameParts.slice(1).join(' ') || ''; // Remaining as last name

    const returnmobileNumber = this.delegateForm.value.mobile_number;
    console.log(returnmobileNumber, 'mobileNumber');
    const delCountryCode = this.delegateForm.value.mobile_number.dialCode;
    const rawMobileNumber = this.delegateForm.value.mobile_number.number;
    let delegateMobileNumber = rawMobileNumber.replace(/[^0-9]/g, ''); // Keeps only numbers;
    console.log(delegateMobileNumber);

    let body = {

      "title": this.delegateForm.value.title,
      "first_name": delegate_firstName,
      "last_name": delegate_lastName,
      "mobile_number": delegateMobileNumber,
      "email_id": this.delegateForm.value.email,
      "country_code": delCountryCode,
      "reference_no": this.referralCode ? this.referralCode : '',
      "dob":"2000-02-19",
      "nom_title":"Mr",
      "nom_first_name":"kunal",
      "nom_last_name":"sharma",
      "nom_mobile_number":"245565",
      "nom_country_code":"",
      "nom_email_id":"kunal@gmail.com",
      "nom_dob":"2000-02-19",
      "nom_country_id":"12",
      "country_id":"",
      "nom_relation":"relation",
      "nom_institution":"nom_institution"
    }
    this.delegateService.postPreDelegateNominationApi(body).subscribe({
      next: async (result: any) => {
        if (result.success) {
          this.sharedService.ToastPopup('', result.message, 'success');
        } else {
          this.sharedService.ToastPopup('', result.message, 'error');
        }
      },
      error: (err) => {
        this.sharedService.ToastPopup('', err.message, 'error');
      },
    })
  }


  submitData(): void {

    if (this.studentForm.valid && this.delegateForm.valid) {
      console.log('Student Form Data:', this.studentForm.value);
      console.log('Delegate Form Data:', this.delegateForm.value);
      this.sharedService.ToastPopup('Please enter required Fields', '', 'error');
      return;
    }

    const returnmobileNumber = this.studentForm.value.mobile_number;
    const returnDOB = this.studentForm.value.dob;

    const rawMobileNumber = this.studentForm.value.mobile_number.number;
    let formattedMobileNumber = rawMobileNumber.replace(/[^0-9]/g, ''); // Keeps only numbers;
    console.log(formattedMobileNumber);

    // Nominee Mobile Number
    let formattedNomineeMobileNumber = '';
    const rawNomineeMobileNumber = this.nominee_mobile_number;

    if (rawNomineeMobileNumber && typeof rawNomineeMobileNumber === 'object') {
      formattedNomineeMobileNumber = rawNomineeMobileNumber.number
        ? rawNomineeMobileNumber.number.replace(/[^0-9]/g, '')
        : '';
    } else if (typeof rawNomineeMobileNumber === 'string') {
      formattedNomineeMobileNumber = rawNomineeMobileNumber.replace(/[^0-9]/g, '');
    }

    if (formattedMobileNumber === formattedNomineeMobileNumber) {
      this.sharedService.ToastPopup(
        'Both Mobile numbers should not be the same',
        '',
        'error'
      );
      return;
    }

    this.studentForm.patchValue({
      country_code: this.studentForm.value.mobile_number.dialCode,
      mobile_number: formattedMobileNumber,
      dob: this.formattedDate
    });


    let payload = {
        ...this.studentForm.value,
        created_by: 'Admin',
        status: '0',
        is_nomination : "1",
        p_type:"DELEGATE_CHILD_NOMINATION",
        p_reference_by:'0'
    }

      this.sharedService.registration(payload).subscribe({
        next: async (result: any) => {


          if (result.success) {

            this.delegateId = result.delegate_id;


            if (this.delegateId) {
              const nomineeBody = {
                delegate_id: this.delegateId,

                mobile_no: formattedNomineeMobileNumber,
              };

              // this.callNominationProfileAPI(nomineeBody, result.url);
            }
          } else {
            // this.SharedService.ToastPopup('', result.message, 'error');
          }
        },
        error: (err) => {

        },
      });
    }
  }
