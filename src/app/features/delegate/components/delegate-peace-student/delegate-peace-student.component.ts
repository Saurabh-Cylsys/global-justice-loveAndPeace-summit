import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-delegate-peace-student',
  templateUrl: './delegate-peace-student.component.html',
  styleUrls: ['./delegate-peace-student.component.css'],
  
})
export class DelegatePeaceStudentComponent {
  userType: 'student' | 'delegate' | null = null; // Tracks user selection
  step: number = 1; // Tracks the current step
  studentForm: FormGroup;
  delegateForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Initialize student form
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      mobileNo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required],
      institutionName: ['', Validators.required],
      relation: ['']
    });

    // Initialize delegate form
    this.delegateForm = this.fb.group({
      name: ['', Validators.required],
      mobileNo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required],
      institutionName: ['', Validators.required],
      relation: ['']
    });
  }

  // Set user type and move to the first step
  setUserType(type: 'student' | 'delegate') {
    this.userType = type;
    this.step = 1; // Start with step 1
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
