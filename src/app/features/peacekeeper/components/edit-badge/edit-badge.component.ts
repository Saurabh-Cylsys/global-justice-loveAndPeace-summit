import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-badge',
  templateUrl: './edit-badge.component.html',
  styleUrls: ['./edit-badge.component.css']
})
export class EditBadgeComponent {

  editBadgeForm! : FormGroup;

  constructor(private fb : FormBuilder){}

  ngOnInit(){
    this.createEditBadgeForm();
  }

  createEditBadgeForm(){
    this.editBadgeForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      country: ['', [Validators.required]],
      mobileNumber: ['', [Validators.required]],
      email: ['', [Validators.required]],
      dob: ['', [Validators.required]]

    });
  }


}
