import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControlName,
  FormBuilder,
  FormArray,
  AbstractControl,
  ValidatorFn,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  CountryISO,
  NgxIntlTelInputComponent,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-tel-input';
import { PeacekeeperService } from '../../services/peacekeeper.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

@Component({
  selector: 'app-edit-badge',
  templateUrl: './edit-badge.component.html',
  styleUrls: ['./edit-badge.component.css']
})
export class EditBadgeComponent {

  editBadgeForm!: FormGroup;
  PeaceBadgeData: any;
  disabledDates: Date[] = [];
  formattedDate: string = '';
  minDate: string | null = null;
  maxDate: string | null = null;
  maxDate1: any;
  minDate1: any;
  colorTheme: string = 'theme-dark-blue';
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  country_codeList: any;
  countryCodes: any;
  country_code: any;
  country_codeISO: any;
  defaultCountryISO: any;
  selectedCountryISO: any;
  submitted = false;
  is_selectedFile: boolean = false;
  countryData: any;
  fileUrl: any;
  isMobile: any;
  mobile_number: string = '';
  mobile_numberVal: boolean = false;
  code: any;
  selectedFile: File | null = null;
  convertedImage: string | null = null;
  isConvertedImage: boolean = true;
  isDragging = false;
  imageChangedEvent: any = '';
  imageFileName: any = '';
  croppedImage: any = '';
  peaceBadge: any;
  formdisplay: boolean = true;
  showPopup: boolean = false;
  isPeaceOn: number = -1;
  display: string = '';
  zoomLevel: number = 1; // Initial zoom level
  transform: ImageTransform = {}; // Object for applying transformations
  imageUrl: string | ArrayBuffer | null = 'assets/UIComponents/images/speakers/ProfileAavtar.png'; // Default image
  isCollapsed = false;

  @ViewChild(NgxIntlTelInputComponent, { static: false }) phoneInput?: NgxIntlTelInputComponent;
  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }
  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private fb: FormBuilder,
    private peaceKeeperService: PeacekeeperService,
    private sharedService: SharedService,
    private ngxService: NgxUiLoaderService,
  ) {
    this.sharedService.isCollapsed$.subscribe(state => {
      this.isCollapsed = state;
    });
    const today = new Date();

    // Max date is 18 years ago from today
    this.maxDate1 = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    // Min date is 120 years ago from today
    this.minDate1 = new Date(today.getFullYear() - 120, 0, 1);
  }
  getcontrol(name: any): AbstractControl | null {
    return this.editBadgeForm.get(name);
  }
  get f() {
    return this.editBadgeForm.controls;
  }
  ngOnInit() {
    this.createEditBadgeForm();
    this.dobValidator();
    this.getAllCountrycode()
    this.getPeaceBadgeData()
  }

  createEditBadgeForm() {
    this.editBadgeForm = this.fb.group({
      full_name: ['', [Validators.required]],
      // lastName: ['', [Validators.required]],
      country: ['', [Validators.required]],
      mobile_number: ['', [Validators.required,
      this.noRepeatingDigits(),
      this.containsConsecutiveZeros(),
      ]],
      email_id: ['', [Validators.required]],
      dob: ['', [Validators.required, this.ageValidator]]

    });
  }


  getPeaceBadgeData() {
    debugger
    let userData = JSON.parse(localStorage.getItem('userDetails') || '')
    console.log(userData);
    let peaceId =  userData.peacekeeper_id
    let body = {
      peace_id: peaceId
    }
    this.peaceKeeperService.getPeacekeeperBadgeById(body).subscribe({
      next: (res: any) => {
        console.log("Res", res);
        if (res.success) {
          // this.sharedService.ToastPopup('PeacekeeperBadge fetched Successful','','success')
          this.PeaceBadgeData = this.sharedService.decryptData(res.data)
          console.log(this.PeaceBadgeData, 'PeaceBadgeData');
          this.peaceBadge = this.PeaceBadgeData.coupon_code;
          this.imageUrl = this.PeaceBadgeData?.file_name


          const dateString = this.PeaceBadgeData.dob; // DD/MM/YYYY format
          const dateObject = new Date(dateString);
          console.log(dateObject);


          const phoneNumber = parsePhoneNumberFromString(this.PeaceBadgeData.mobile_number);
          if (phoneNumber) {
            const countryDialCode = phoneNumber.countryCallingCode; // e.g., 91
            const nationalNumber = phoneNumber.nationalNumber; // e.g., 8120926413
            
            this.setCountryByDialCode(countryDialCode);
            setTimeout(() => {
            }, 100);
            this.editBadgeForm.patchValue({
                  mobile_number: {
                    number: nationalNumber,
                    countryCode: this.country_codeISO
                  },
    
                });
          }
        
          
          this.editBadgeForm.patchValue({
            full_name: this.PeaceBadgeData.full_name,
            country: this.PeaceBadgeData.country,
            email_id: this.PeaceBadgeData.email_id,
             dob: dateObject

          });
          console.log(this.editBadgeForm, 'editBadgeForm');

          this.ngxService.stop();

        }

      }
    })
  }
  setCountryByDialCode(dialCode: string) {

    if (this.phoneInput) {
      const countryList = this.phoneInput.allCountries;
      const country = countryList.find(c => c.dialCode === dialCode);
      if (country) {
        // this.phoneInput.selectedCountry = country;
        this.country_codeISO = country.iso2;
      }


    }
  }

  updatePeacekeeper(fileInput: HTMLInputElement): void {
    debugger
    const returnmobileNumber = this.editBadgeForm.value.mobile_number;
    const returnDOB = this.editBadgeForm.value.dob;
    console.log(returnmobileNumber,'mobileNumber');

    const rawMobileNumber = this.editBadgeForm.value.mobile_number.number;
    const formattedMobileNumber = rawMobileNumber.replace(/\s+/g, ''); // Removes all spaces
    console.log(formattedMobileNumber);
console.log(this.phoneInput, 'phoneInput');

    this.editBadgeForm.patchValue({
      is_active: 1,
      mobile_number:
        this.editBadgeForm.value.mobile_number.dialCode +
        ' ' +
        formattedMobileNumber,
        dob: this.formattedDate

    });


    const FromData = {
      id:this.PeaceBadgeData.peacekeeper_id,
      full_name:this.editBadgeForm.value.full_name,
      country:this.editBadgeForm.value.country,
      email_id:this.editBadgeForm.value.email_id,
      mobile_number:this.editBadgeForm.value.mobile_number,
      dob:this.formattedDate,
      Check_email:1,
      is_active:1,
      url:this.PeaceBadgeData.url
    }

    const EncryptData = this.sharedService.encryptData(FromData);
    const encryptedPayload = new FormData();
    encryptedPayload.append('encrypted_data', EncryptData);

    if (this.selectedFile) {
      encryptedPayload.append(
        'profile_picture',
        this.selectedFile,
        this.selectedFile.name
      );
    }



    console.log(this.editBadgeForm.value);

    // Show loader
    this.ngxService.start();

    // Call the service to submit data
    this.peaceKeeperService.updatePeacekeeper(encryptedPayload).subscribe(
      (response: any) => {
        if (response.success) {
          this.submitted = true;
          this.ngxService.stop();
          console.log('response', response);
          this.peaceBadge = response.batch;
          debugger
          const userData = {
            full_name : this.PeaceBadgeData.full_name,
            peacekeeper_id : this.PeaceBadgeData.peacekeeper_id,
            file_name : this.PeaceBadgeData?.file_name,
          }
          // this.sharedService.setUserDetails(JSON.stringify(userData));
          localStorage.setItem('userDetails', JSON.stringify(userData));
          this.sharedService.ToastPopup('', response.message, 'success');
          this.is_selectedFile = false;
          this.editBadgeForm.reset();

          this.selectedFile = null;
          fileInput.value = '';
          this.imageUrl = '';
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          // this.getPeaceBadgeData();
        } else {
          this.ngxService.stop();
          this.sharedService.ToastPopup('', response.message, 'error');
        }
      },
      (err) => {
          this.editBadgeForm.patchValue({
          mobile_number: returnmobileNumber,
          dob: returnDOB,
        });
        this.ngxService.stop();

        this.sharedService.ToastPopup('', err.error.message, 'error');
      }
    );
  }



  getAllCountrycode() {
    this.peaceKeeperService.getAllCountrycode().subscribe(
      (res: any) => {
        console.log('code', res.data);
        this.code = res.data;
        const countryToFind = 'India';

      },
      (err: any) => {
        console.log('error', err);
      }
    );
  }

  onDateChange(event: string): void {
    // Convert the date format
    const parsedDate = new Date(event);
    this.formattedDate = this.datePipe.transform(parsedDate, 'yyyy-MM-dd') || '';

  }

  get dob() {
    return this.editBadgeForm.get('dob');
  }

  //DOB validation

  dobValidator() {
    const today = new Date();

    // Calculate the date 18 years ago from today
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    this.maxDate = eighteenYearsAgo.toISOString().split('T')[0]; // Max date = 18 years ago
    this.minDate = `${today.getFullYear() - 120}-01-01`; // Min date = 120 years ago

    // Set disabledDates (any date after maxDate)
    this.disabledDates = [eighteenYearsAgo]; // Disabling the date of 18 years ago
    console.log(`Max date (18 years ago): ${this.maxDate}`);
  }

  ageValidator(control: FormControl) {
    const selectedDate = new Date(control.value);

    // If the selected date is invalid, return an error
    if (isNaN(selectedDate.getTime())) {
      return { invalidDate: true }; // Invalid date format
    }

    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    // If selected date is after or on the date 18 years ago, it's invalid
    if (selectedDate > eighteenYearsAgo) {
      return { ageError: 'Date must be at least 18 years ago' };
    }

    return null; // Valid date
  }
  disableManualInput(event: KeyboardEvent): void {
    event.preventDefault();
  }

  //Mobile validation

  onMobileKeyDown(event: KeyboardEvent, inputValue: any): void {
    // Check if the pressed key is the space bar and the input is empty
    console.log('form', this.editBadgeForm.controls['mobile_number']);

    if (inputValue !== null) {
      if (event.key === ' ' && inputValue.trim() === '') {
        event.preventDefault(); // Prevent the space character from being typed
      } else if (event.code === 'Backspace') {
        if (inputValue.number.length < 7) {
          this.mobile_numberVal = true;
          // event.preventDefault()

        } else {
          console.log('form', this.editBadgeForm.controls['mobile_number'].errors?.['validatePhoneNumber']['valid']);
          this.mobile_numberVal = false;
        }
      }
    }
  }

  noRepeatingDigits(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value as string;
      if (value && value.length === 10) {
        // Check for repeating digits
        const repeatingDigits = /(.)\1{5,}/.test(value);
        if (repeatingDigits) {
          return { repeatingDigits: true };
        }
      }
      return null;
    };
  }
  containsConsecutiveZeros(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value as string;
      if (value && /000000/.test(value)) {
        return { containsConsecutiveZeros: true };
      }
      return null;
    };
  }


  keyPressNumbers(event: KeyboardEvent, inputValue: any) {
    //
    if (inputValue !== null) {
      if (inputValue.number.length < 7) {
        this.mobile_numberVal = true;
        // event.preventDefault()
      } else {
        this.mobile_numberVal = false;
      }
    }
  }

  onKeyDown(event: KeyboardEvent, inputValue: any): void {
    // Check if the pressed key is the space bar and the input is empty
    if (event.key === ' ' && inputValue.trim() === '') {
      event.preventDefault(); // Prevent the space character from being typed
    }
  }


  /** ✅ Function to Display Validation Message */
  getPhoneErrorMessage() {
    debugger
    const control = this.editBadgeForm.controls['mobile_number'];

    // if (control.errors?.['validatePhoneNumber']['valid']) {
    //   return '';
    // } else {
    //   return 'Invalid mobile number for selected country.';
    // }
  }

  ValidateAlpha(event: any) {
    var keyCode = event.which ? event.which : event.keyCode;

    if (
      (keyCode < 65 || keyCode > 90) &&
      (keyCode < 97 || keyCode > 123) &&
      keyCode != 32
    )
      return false;
    return true;
  }


  getCountrycode(code: any) {
    let countryName = this.editBadgeForm.value.country;
    const indiaCodeObject = code.find((item: any) => item.name === countryName);
    console.log(indiaCodeObject);

    this.editBadgeForm.patchValue({

      country_code: indiaCodeObject.code,
    });
  }

  onInput(event: any, controlName: string) {
    const trimmedValue = event.target.value.replace(/^\s+/, ''); // Remove leading spaces
    this.editBadgeForm.controls[controlName].setValue(trimmedValue, { emitEvent: false });
  }


  //image 

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imageUrl = reader.result;
      };

      reader.readAsDataURL(file);
    }
  }


  onFileChange(event: any): void {
  
    this.imageChangedEvent = event;
    console.log(this.imageChangedEvent, 'on select');
    this.imageFileName = event.target.files[0].name;
    const file = event.target.files[0];

    if (file) {
      const validExtensions = ['image/jpg', 'image/jpeg', 'image/png'];
      const minSize = 204800; // 200KB
      const maxSize = 5242880; // 5MB

      // Validate the file type
      if (!validExtensions.includes(file.type)) {
        this.sharedService.ToastPopup('', 'Invalid file type! Please select a JPG or PNG file.', 'error')
        event.target.value = ''; // Reset the file input
        this.is_selectedFile = false;
        return;
      }
          // Validate the file size
    if (file.size < minSize || file.size > maxSize) {
      this.sharedService.ToastPopup('', 'Invalid file size! Please select an image between 200KB to 5MB.', 'error');
      event.target.value = ''; // Reset the file input
      this.is_selectedFile = false;
      return;
    }

      this.isPeaceOn = 2;
      this.showPopup = true;
      this.display = 'block'
      this.formdisplay = false;

    }
    else {
      console.log('No file selected.');
    }


  }


    imageCropped(event: ImageCroppedEvent): void {
      this.croppedImage = event.objectUrl;
      console.log(this.imageFileName, 'cropping');
  
      // Assuming 'event.objectUrl' is the Blob URL returned from the cropper
      fetch(this.croppedImage)
        .then((response) => response.blob()) // Fetch the image blob
        .then((blob) => {
          // Create a File object from the Blob
          const file = new File([blob], this.imageFileName, {
            type: blob.type,
            lastModified: Date.now(), // You can set this to the actual last modified timestamp if needed
          });
  
          // Now you can append the file data to your payload
          const payload = {
            file: file,
            otherData: 'your other data here',
          };
  
          // For example, logging the file details
          console.log(file);
          console.log(payload);
  
          const newFile = file;
          if (newFile) {
            this.selectedFile = newFile;
            this.is_selectedFile = true;
          }
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.imageUrl = e.target.result; // Set the preview URL
          };
          reader.readAsDataURL(newFile);
          console.log('Selected file:', this.selectedFile);
  
          // Proceed with your request or any other operation with 'payload'
        })
        .catch((error) => {
          console.error('Error fetching the image:', error);
        });
    }

  cropperReady() {
    this.imageChangedEvent = '';
    this.display = 'none';
    this.showPopup = false;
    // Optional: Cropper ready event
  }

  closeImageModal() {
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    fileInput.value = '';
    this.is_selectedFile = false;
    this.display = 'none';
    this.showPopup = false;
    this.selectedFile = null;
  }

    // Zoom In
    zoomIn(): void {
      if (this.zoomLevel < 5) {
        // Maximum zoom level
        this.zoomLevel += 0.1;
        this.applyZoom();
      }
    }
  
    // Zoom Out
    zoomOut(): void {
      if (this.zoomLevel > 1) {
        // Minimum zoom level
        this.zoomLevel -= 0.1;
        this.applyZoom();
      }
    }
  
    // Apply Zoom
    applyZoom(): void {
      this.transform = {
        ...this.transform,
        scale: this.zoomLevel, // Apply zoom level
      };
    }
  

}
