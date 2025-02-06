import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-upload-contacts',
  templateUrl: './upload-contacts.component.html',
  styleUrls: ['./upload-contacts.component.css']
})
export class UploadContactsComponent {

  @ViewChild('inputFile') myInputVariable!: ElementRef;

  selectedFile: File | null = null;
  list_contacts: any;
  listName: any = "";
  isNewList: boolean = true;
  list_id: any = "";
  selectedList: any = "";
  actionValue: any = 1;
  letItBeValue : any = 1;
  replaceValue : any = 0;

  constructor(
              private _shared: SharedService,
              private _router: Router,
              private ngxLoader: NgxUiLoaderService,
              ) {
  }

    ngOnInit(): void {
      this.getContactList();
    }

  handleFileInput(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const fileName = this.selectedFile.name;
      if (fileName.endsWith('.xlsx')) {

        // this._shared.setSelectedFile(this.selectedFile);
      } else {
        this._shared.ToastPopup('Invalid file format. Please select a file with the .xlsx extension','','error');
        this.selectedFile = null;
      }
    }
  }

  setLetItBeValue(value: any) {
    this.letItBeValue = value;

    if(this.letItBeValue == 1){
      this.replaceValue = 0;
    }
  }

  setReplaceValue(value: any) {
    this.replaceValue = value;

    if(this.replaceValue == 1){
      this.letItBeValue = 0;
    }

  }

  uploadContacts(){

    let formData = new FormData();
    let listName : any = localStorage.getItem('listName');
    let list_id : any = localStorage.getItem('list_id');
    if(this.selectedFile){
      if(this.isNewList) {
        formData.append('contacts', this.selectedFile);
        formData.append('status', 'step_1');
        formData.append('list_name',listName)
        formData.append('source_id','1')

      }
      else {
        formData.append('contacts', this.selectedFile);
        formData.append('status', 'step_1');
        formData.append('list_name',listName);
        formData.append('list_id',list_id);
        formData.append('source_id','1')


        if(this.letItBeValue == 1){
          localStorage.setItem('letItBeValue',this.letItBeValue);
          localStorage.setItem('replaceValue', '0');
          formData.append('let_it_be',this.letItBeValue);
        }
        if(this.replaceValue == 1) {
          localStorage.setItem('replaceValue',this.replaceValue);
          localStorage.setItem('letItBeValue','0');
          formData.append('replace', this.replaceValue);
        }
      }

    }
    else{
      this._shared.ToastPopup("Please Select file",'','error');
      return;
    }

      this.ngxLoader.start();

    // this.contact_Service.uploadContactsApi(formData).subscribe((res:any)=>{

    //   this.ngxLoader.stop();
    //   localStorage.setItem("review_contact",JSON.stringify(res));
    //    this._router.navigate(['/review']);
    // })

  }

  continue(){
    // this.uploadContacts();
    if(this.isNewList){
      this.addList();
    }else{
      this.uploadContacts();
    }
  }

  reset() {
    this.myInputVariable.nativeElement.value = '';
    this.selectedFile = null;
  }

  getContactList(){

    // this.ngxLoader.start();
    // this.listService.getListApi().subscribe((res:any)=>{
    //   this.ngxLoader.stop();
    //   this.list_contacts = res.data;

    // })
  }

  addList() {

    let body = {
      "list_name": this.listName,
      "source_id":1
    }

    localStorage.setItem('listName', this.listName)

    // this.listService.checkListNameApi(body).subscribe((res: any) => {

    //   if (res.success) {
    //     this.uploadContacts();
    //   }
    // }, (err) => {
    //   console.log("Error", err);
    //   this.listName = "";
    // })
  }

  toggleListType(isNew: boolean) {

    this.isNewList = isNew;
    if(this.isNewList == true){
      this.list_id = "";
      this.listName = "";
    }
    else {
      this.listName = "";
    }
  }

  changeList(event:any){
    this.list_id = event.target.value;
  }

  changeListName(){

    if (this.selectedList) {

      this.listName = this.selectedList.list_name;
      this.list_id = this.selectedList.list_id;

      localStorage.setItem('listName', this.listName);
      localStorage.setItem('list_id', this.list_id);

    }
  }
}
