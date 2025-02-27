import { DatePipe } from '@angular/common';
import { Component, HostListener, Renderer2, ViewChild } from '@angular/core';
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
  styleUrls: ['./edit-badge.component.css'],
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
  previousCroppedImage: any = '';
  croppedImage: any = '';
  peaceBadge: any;
  formdisplay: boolean = true;
  showPopup: boolean = false;
  isPeaceOn: number = -1;
  display: string = '';
  zoomLevel: number = 1; // Initial zoom level
  transform: ImageTransform = {}; // Object for applying transformations
  imageUrl: string | ArrayBuffer | null =
    'assets/UIComponents/images/peacekeeper/ProfileAavtar.png'; // Default image
  isCollapsed = false;
  isMobileView = false;
  isDisabled = true;

  @ViewChild(NgxIntlTelInputComponent, { static: false })
  phoneInput?: NgxIntlTelInputComponent;
  tempSelectedFile: any;
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
    private renderer: Renderer2
  ) {
    this.sharedService.isCollapsed$.subscribe((state) => {
      this.isCollapsed = state;
    });
    const today = new Date();

    // Max date is 18 years ago from today
    this.maxDate1 = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );

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
    this.getAllCountrycode();
    this.getPeaceBadgeData();
    this.checkWindowSize();

  }

  createEditBadgeForm() {
    this.editBadgeForm = this.fb.group({
      full_name: ['', [Validators.required]],
      // lastName: ['', [Validators.required]],
      country: ['', [Validators.required]],
      mobile_number: [
        '',
        [
          Validators.required,
          this.noRepeatingDigits(),
          this.containsConsecutiveZeros(),
        ],
      ],
      email_id: ['', [Validators.required]],
      dob: ['', [Validators.required, this.ageValidator]],
    });
  }

  getPeaceBadgeData() {
    let userData = JSON.parse(localStorage.getItem('userDetails') || '');

    let peaceId = userData.peacekeeper_id;
    let body = {
      peace_id: peaceId,
    };

    this.ngxService.start();
    this.peaceKeeperService.getPeacekeeperBadgeById(body).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.ngxService.stop();
          this.PeaceBadgeData = this.sharedService.decryptData(res.data);


          this.peaceBadge = this.PeaceBadgeData.coupon_code;
          this.imageUrl = this.PeaceBadgeData?.file_name;

          const dateString = this.PeaceBadgeData.dob; // DD/MM/YYYY format
          const dateObject = new Date(dateString);

          const phoneNumber = parsePhoneNumberFromString(
            this.PeaceBadgeData.mobile_number
          );
          if (phoneNumber) {
            const countryDialCode = phoneNumber.countryCallingCode; // e.g., 91
            const nationalNumber = phoneNumber.nationalNumber; // e.g., 8120926413

            this.setCountryByDialCode(countryDialCode);
            setTimeout(() => {}, 100);
            this.editBadgeForm.patchValue({
              mobile_number: {
                number: nationalNumber,
                countryCode: this.country_codeISO,
              },
            });
          }

          this.editBadgeForm.patchValue({
            full_name: this.PeaceBadgeData?.full_name,
            country: this.PeaceBadgeData?.country,
            email_id: this.PeaceBadgeData?.email_id,
            dob: dateObject,
          });

          this.editBadgeForm.get('country')?.disable();
          this.editBadgeForm.get('mobile_number')?.disable();
          this.editBadgeForm.get('email_id')?.disable();
          console.log("form",this.editBadgeForm.value);
        }

        // this.editBadgeForm.get('country')?.disable();
        // this.editBadgeForm.get('mobile_number')?.disable();
      },
      error : (err)=>{
        console.log("err",err);
        this.ngxService.stop();
        this.sharedService.ToastPopup('', err.error.message, 'error');
      }
    });
  }


  setCountryByDialCode(dialCode: string) {
    if (this.phoneInput) {
      const countryList = this.phoneInput.allCountries;
      const country = countryList.find((c) => c.dialCode === dialCode);
      if (country) {
        // this.phoneInput.selectedCountry = country;
        this.country_codeISO = country.iso2;
      }
    }
  }

  updatePeacekeeper(): void {

    const peacKeeperformData = this.editBadgeForm.getRawValue(); // ✅ Includes disabled fields
    console.log(peacKeeperformData);

    if (!this.editBadgeForm.value.full_name?.trim() || this.editBadgeForm.value.full_name.trim().length < 3) {
      this.renderer.selectRootElement('#fullName').focus();
      this.sharedService.ToastPopup('Full Name must be at least 3 characters long','','error');
      return;
    } else if (this.editBadgeForm.value.dob == '' || this.editBadgeForm.value.dob == undefined) {
      this.renderer.selectRootElement('#dob').focus();
      this.sharedService.ToastPopup('Please Select Date Of Birth', '', 'error');
      return;
    } else if (peacKeeperformData.country == '' || peacKeeperformData.country == undefined) {
      setTimeout(() => {
        const countryElement = this.renderer.selectRootElement('#country',true );
        if (countryElement) {
          countryElement.focus();
        }
      }, 100);
      this.sharedService.ToastPopup('Please select country', '', 'error');
      return;
    }
    else if (
      peacKeeperformData.mobile_number == '' ||
      peacKeeperformData.mobile_number == undefined ||
      peacKeeperformData.mobile_number == null
    ) {
      setTimeout(() => {
        const inputElement = document.querySelector(
          '#number_mobile1 input'
        ) as HTMLInputElement;
        if (inputElement) {
          inputElement.focus();
        } else {
          console.error('Could not find mobile number input field');
        }
      }, 100);
      this.sharedService.ToastPopup('Please Enter  Mobile Number', '', 'error');
      return;
    } else if (
      this.editBadgeForm.controls['mobile_number'].errors &&
      !this.editBadgeForm.controls['mobile_number'].errors?.[
        'validatePhoneNumber'
      ]?.valid
    ) {
      setTimeout(() => {
        const inputElement = document.querySelector(
          '#number_mobile1 input'
        ) as HTMLInputElement;
        if (inputElement) {
          inputElement.focus();
        } else {
          console.error('Could not find mobile number input field');
        }
      }, 100);
      this.sharedService.ToastPopup(
        'Please enter a valid mobile number for the selected country',
        '',
        'error'
      );
      return;
    }


    const returnmobileNumber = peacKeeperformData.mobile_number;
    const returnDOB = this.editBadgeForm.value.dob;

    const rawMobileNumber = peacKeeperformData.mobile_number.number;
    const formattedMobileNumber = rawMobileNumber.replace(/\s+/g, ''); // Removes all spaces

    this.editBadgeForm.patchValue({
      is_active: 1,
      mobile_number:
      peacKeeperformData.mobile_number.dialCode +
        ' ' +
        formattedMobileNumber,
        dob: this.formattedDate,
    });

    const formData = {
      id: this.PeaceBadgeData.peacekeeper_id,
      full_name: this.editBadgeForm.value.full_name,
      country: peacKeeperformData.country,
      email_id: peacKeeperformData.email_id,
      mobile_number: peacKeeperformData.mobile_number.dialCode + ' ' +
        formattedMobileNumber,
      dob: this.formattedDate,
      Check_email: 1,
      is_active: 1,
      url: this.PeaceBadgeData.url,
    };


    const EncryptData = this.sharedService.encryptData(formData);
    const encryptedPayload = new FormData();
    encryptedPayload.append('encrypted_data', EncryptData);
    this.getAllCountrycode();

    if (this.selectedFile) {
      encryptedPayload.append(
        'profile_picture',
        this.selectedFile,
        this.selectedFile.name
      );
    }

    // Show loader
    this.ngxService.start();

    console.log("FormData",formData)

    // Call the service to submit data
    this.peaceKeeperService.updatePeacekeeper(encryptedPayload).subscribe(
      async (response: any) => {
        if (response.success) {
          this.submitted = true;
          this.ngxService.stop();
          this.peaceBadge = response.batch;
          const userData = {
            full_name: this.PeaceBadgeData.full_name,
            peacekeeper_id: this.PeaceBadgeData.peacekeeper_id,
            file_name: this.PeaceBadgeData?.file_name,
            qr_code : this.PeaceBadgeData?.QR_CODE,
            email_id : this.PeaceBadgeData?.email_id

          };

          localStorage.setItem('userDetails', JSON.stringify(userData));
          this.sharedService.ToastPopup('Peacekeeper Badge Updated Successfully!', '', 'success');
          //this.is_selectedFile = false;
          // this.editBadgeForm.reset();

          // this.selectedFile = null;
          // // fileInput.value = '';
          // this.imageUrl = '';

          await this.sharedService.refreshHeader();

          // setTimeout(() => {
          //   const currentUrl = this.router.url;
          //   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          //     this.router.navigate([currentUrl]);
          //   });
          // }, 2000);

          // this.router.navigate(['/dashboard']);

          setTimeout(() => {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/dashboard']);
            });
          }, 3000);

          // setTimeout(() => {
          //   window.location.reload();
          // }, 5000);
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
    this.formattedDate =
      this.datePipe.transform(parsedDate, 'yyyy-MM-dd') || '';
  }

  get dob() {
    return this.editBadgeForm.get('dob');
  }

  //DOB validation

  dobValidator() {
    const today = new Date();

    // Calculate the date 18 years ago from today
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
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
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );

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

    if (inputValue !== null) {
      if (event.key === ' ' && inputValue.trim() === '') {
        event.preventDefault(); // Prevent the space character from being typed
      } else if (event.code === 'Backspace') {
        if (inputValue.number.length < 7) {
          this.mobile_numberVal = true;
          // event.preventDefault()
        } else {
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

  onPasteMobileNumber(event: ClipboardEvent) {
    event.preventDefault(); // Block default paste action
    const text = event.clipboardData?.getData('text') || '';

    // Allow only numbers (0-9)
    if (/^\d+$/.test(text)) {
      const input = event.target as HTMLInputElement;
      input.value += text; // Append only valid numbers
      input.dispatchEvent(new Event('input')); // Update Angular form control
    }
  }

  /** ✅ Function to Display Validation Message */
  getPhoneErrorMessage() {
    const control = this.editBadgeForm.controls['mobile_number'];
    if (control.value) {
      if (control.errors?.['validatePhoneNumber']['valid']) {
        return '';
      } else {
        return 'Invalid mobile number for selected country.';
      }
    }
    return ''; // Ensure a value is always returned
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

    this.editBadgeForm.patchValue({
      country_code: indiaCodeObject.code,
    });
  }

  onInput(event: any, controlName: string) {
    const trimmedValue = event.target.value.replace(/^\s+/, ''); // Remove leading spaces
    this.editBadgeForm.controls[controlName].setValue(trimmedValue, {
      emitEvent: false,
    });
  }

  //image

  // onFileSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files[0]) {
  //     const file = input.files[0];
  //     const reader = new FileReader();

  //     reader.onload = () => {
  //       this.imageUrl = reader.result;
  //     };

  //     reader.readAsDataURL(file);
  //   }
  // }

  onFileChange(event: any): void {
    this.imageChangedEvent = event;
    this.imageFileName = event.target.files[0].name;
    const file = event.target.files[0];

    if (file) {
      const validExtensions = ['image/jpg', 'image/jpeg', 'image/png'];
      const minSize = 204800; // 200KB
      const maxSize = 5242880; // 5MB

      // Validate the file type
      if (!validExtensions.includes(file.type)) {
        this.sharedService.ToastPopup(
          '',
          'Invalid file type! Please select a JPG or PNG file.',
          'error'
        );
        event.target.value = ''; // Reset the file input
        this.is_selectedFile = false;
        return;
      }
      // Validate the file size
      // if (file.size < minSize || file.size > maxSize) {
      //   this.sharedService.ToastPopup(
      //     '',
      //     'Invalid file size! Please select an image between 200KB to 5MB.',
      //     'error'
      //   );
      //   event.target.value = ''; // Reset the file input
      //   this.is_selectedFile = false;
      //   return;
      // }

      this.tempSelectedFile = file; // Store the file temporarily


      this.isPeaceOn = 2;
      this.showPopup = true;
      this.display = 'block';
      this.formdisplay = false;
    } else {
      console.log('No file selected.');
    }
  }

  openPopup() {

    this.showPopup = true;
    this.isPeaceOn = 0;
    this.display = 'block';
    this.formdisplay = false;
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.objectUrl;
    this.previousCroppedImage = this.imageUrl;
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
    this.imageUrl = this.PeaceBadgeData?.file_name// this.previousCroppedImage
    this.is_selectedFile = false;
    this.display = 'none';
    this.showPopup = false;
    this.selectedFile = null;
    this.tempSelectedFile = null;
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

  checkWindowSize(): void {
    if (window.innerWidth <= 900) {
      this.sharedService.isMobileView.next(true);
      this.isMobileView = true;
    } else {
      this.sharedService.isMobileView.next(false);
      this.isMobileView = false;
    }
  }
  // Listen to window resize events
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkWindowSize();
  }

  downloadImage() {
    if (this.peaceBadge) {
      fetch(this.peaceBadge)
      .then(response => response.blob())  // Convert response to Blob
      .then(blob => {
        const url = URL.createObjectURL(blob); // Create an object URL for the blob
        const link = document.createElement('a');
        link.href = url;
        link.download = 'peacekeeper-card.png'; // Ensure it's saved as PNG
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Clean up the object URL
      })
      .catch(error => console.error('Error downloading the image:', error));
    }


    setTimeout(() => {
      this.display = 'none';
      this.showPopup = false;
    }, 500);
  }

  closeModal() {
    this.display = 'none';
    this.showPopup = false;
  }
}
