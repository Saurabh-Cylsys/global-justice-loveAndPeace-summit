import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { DelegateService } from '../../services/delegate.service';
import { DatePipe } from '@angular/common';
import { SharedService } from 'src/app/shared/services/shared.service';
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
  mobile_numberVal: boolean = false;
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
  delegateMaxDate: Date;
  delegateMinDate: Date;

  constructor(private fb: FormBuilder, private delegateService: DelegateService,private datePipe: DatePipe,private sharedService:SharedService) {

    const today = new Date();

    // Max date is 18 years ago from today
    this.maxDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );

    // Min date is 120 years ago from today
    this.minDate = new Date(today.getFullYear() - 120, 0, 1);


    this.maxDate = new Date(
      today.getFullYear() - 1,
      today.getMonth(),
      today.getDate()
   );

    // Min date is 21 years ago from today
    this.minDate = new Date(
    today.getFullYear() - 21,
    today.getMonth(),
    today.getDate() + 1
  );

        // Max date is 21 years ago from today
    this.delegateMaxDate = new Date(
      today.getFullYear() - 21,
      today.getMonth(),
      today.getDate()
    );

    // Min date is 120 years ago from today
    this.delegateMinDate = new Date(today.getFullYear() - 120, 0, 1);

  }

  ngOnInit(){

    this.initializeStudentForm();
    this.initializeDelegateForm();

    this.getAllCountries();

  }

  initializeStudentForm() {
     // Initialize student form
     this.studentForm = this.fb.group({
      name: ['', Validators.required],
      studentDob :['', Validators.required],
      mobile_number: ['', [Validators.minLength(7), Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required],
      institutionName: ['', Validators.required],
      relation: ['']
    });
  }

  initializeDelegateForm(){
    // Initialize delegate form
    this.delegateForm = this.fb.group({
      name: ['', Validators.required],
      mobile_number: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required],
      // institutionName: ['', Validators.required],
      delegateDob :['', Validators.required],
      relation: ['']
    });
  }

  // Set user type and move to the first step
  setUserType(type: 'student' | 'delegate') {
    this.userType = type;
    this.step = 1; // Start with step 1
  }

  getcontrol(name: any): AbstractControl | null {
    return this.delegateForm.get(name);
  }

  // Move to the next step
  nextStep() {
    if (this.step === 1 && this.userType === 'student' && this.studentForm.valid) {
      this.step = 2; // Move to Delegate Form
    } else if (this.step === 1 && this.userType === 'delegate' && this.delegateForm.valid) {
      this.step = 2; // Move to Student Form
    }
  }

  // Move to the previous step
  previousStep() {
    this.step = 1; // Go back to the first step
  }

  disableManualInput(event: KeyboardEvent): void {
    event.preventDefault();
  }

  onDateChange(event: string): void {
    // Convert the date format
    const parsedDate = new Date(event);
    this.formattedDate =
      this.datePipe.transform(parsedDate, 'yyyy-MM-dd') || '';
  }

  onUserDobChange(event: string): void {
    if (!event) return; // Handle empty date input

    const dob = new Date(event);
    const newAge = this.calculateAge(dob);

    if (this.StudentAge !== newAge) {
      this.StudentAge = newAge;
      console.log('User Age Updated:', this.StudentAge);
    } else {
      console.log('No Change in User Age, Skipping Update');
    }

    this.formattedDate = this.datePipe.transform(dob, 'yyyy-MM-dd') || '';

    if (this.studentDob !== event) {
      this.studentDob = event;
      this.formattedDate = this.datePipe.transform(dob, 'yyyy-MM-dd') || '';
    }

    // Perform validation
    this.validateUserAge();
  }

  onNomineeDobChange(event: string): void {
    if (!event) return; // Handle empty date input

    const dob = new Date(event);
    const newAge = this.calculateAge(dob);

    if (this.delegateAge !== newAge) {
      this.delegateAge = newAge;
      console.log('Nominee Age Updated:', this.delegateAge);
    } else {
      console.log('No Change in Nominee Age, Skipping Update');
    }

    const parsedDate = new Date(event);
    // this.formattedDate = this.datePipe.transform(parsedDate, 'yyyy-MM-dd') || '';

    this.nomineeFormattedDate = this.datePipe.transform(parsedDate, 'yyyy-MM-dd') || '';

    if (this.delegateDob !== event) {

      this.delegateDob = event;
      this.nomineeFormattedDate =this.datePipe.transform(dob, 'yyyy-MM-dd') || '';
    }

    // Perform validation
    this.validateNomineeAge();
  }

  // Common function to calculate age
  private calculateAge(dob: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    // Adjust age if the birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  }

  // Validation for User Age (Student or Adult)
  private validateUserAge(): void {
    if (this.userType === 'student') {
      if (this.StudentAge <= 0 || this.StudentAge >= 21) {
        this.sharedService.ToastPopup(
          'As a Student, your age must be between 1 and less than 21.',
          '',
          'error'
        );
        return;
      }
    } else if (this.userType === 'delegate') {
      if (this.StudentAge < 21) {
        this.sharedService.ToastPopup(
          'As an Adult, your age must be 21 or older.',
          '',
          'error'
        );
        return;
      }
    }
  }

  // Validation for Nominee Age
  private validateNomineeAge(): void {
    if (this.userType === 'student') {
      if (this.delegateAge <= 21) {
        this.sharedService.ToastPopup(
          'As a Student, your nominee must be older than 21.',
          '',
          'error'
        );
        return;
      }
    } else if (this.userType === 'delegate') {
      if (this.delegateAge >= 21 || this.delegateAge <= 0) {
        this.sharedService.ToastPopup(
          'As an Adult, your nominee must be between 1 and less than 21.',
          '',
          'error'
        );
        return;
      }
    }
  }

  openDatepicker() {
    const dobInput = document.getElementById('dob') as HTMLInputElement;
    if (dobInput) {
      dobInput.click(); // Open ngx-bootstrap datepicker
    }
  }

  keyPressNumbers(event: KeyboardEvent) {
    const inputValue = this.studentForm.controls['mobile_number'].value; // Get value from form control
    if (inputValue && inputValue.number) {
      if (inputValue.number.length < 7) {
        this.mobile_numberVal = true;
      } else {
        this.mobile_numberVal = false;
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
      alert('Forms submitted successfully!');
    } else {
      alert('Please fill out all required fields.');
    }
  }
}
