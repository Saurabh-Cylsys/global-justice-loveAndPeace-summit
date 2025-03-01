import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-delegate-peace-student',
  templateUrl: './delegate-peace-student.component.html',
  styleUrls: ['./delegate-peace-student.component.css'],
  
})
export class DelegatePeaceStudentComponent {
  userType: 'student' | 'delegate' | null = null; // No default selection
  showForms: boolean = false; // Controls form visibility
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

  // Set user type and show forms
  setUserType(type: 'student' | 'delegate') {
    this.userType = type;
    this.showForms = true; // Show forms when a selection is made
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
