import { Component } from '@angular/core';

@Component({
  selector: 'app-download-brochure',
  templateUrl: './download-brochure.component.html',
  styleUrls: ['./download-brochure.component.css']
})
export class DownloadBrochureComponent {

  // downloadPDF() {
  //   debugger;
  //   const fileUrl = 'assets/UIComponents/files/GJLPS-Brochure-english.pdf'; // Path to your PDF file in the assets folder
  //   const a = document.createElement('a');
  //   a.href = fileUrl;
  //   a.download = 'GJLPS-Brochure-english.pdf'; // Name of the downloaded file
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  // }

  downloadPDF(language: 'English' | 'French' | 'Portuguese') {
    const fileUrls: { [key in 'English' | 'French' | 'Portuguese']: string } = {
      English: 'assets/UIComponents/files/GJLPS-Brochure-english.pdf',
      French: 'assets/UIComponents/files/GJLPS-Brochure-FRENCH.pdf',
      Portuguese: 'assets/UIComponents/files/GJLPS-Brochure-PORTUGUESE.pdf',
    };
  
    const fileUrl = fileUrls[language];
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = `GJLPS-Brochure-${language.toLowerCase()}.pdf`; // Name of the downloaded file
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
  
}
