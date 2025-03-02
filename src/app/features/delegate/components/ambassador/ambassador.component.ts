import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DelegateService } from '../../services/delegate.service';

@Component({
  selector: 'app-ambassador',
  templateUrl: './ambassador.component.html',
  styleUrls: ['./ambassador.component.css']
})
export class AmbassadorComponent {
  
  name: string | null = null;

  constructor(private router: Router, private route: ActivatedRoute,private delegateService:DelegateService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      this.name = params.get('name'); // Retrieve the 'name' parameter from the URL
      if (this.name) {
        // Navigate to the desired route with the 'name' parameter
        let body = {
          "coupon_code": this.name
        }
        await this.delegateService.getAmbassadorURL(body).subscribe((resp:any) => {
          console.log(resp);         
          /**{
          "url": "https://www.justice-love-peace.com/delegate-registration?code=COIND-0000072-A",
          "success": true,
          "error": false
      } */


          if(resp.success){
            let url = resp.url;
            url = url.replace('https://www.justice-love-peace.com', '/');

            // Extract the 'code' parameter from the URL
            const urlObj = new URL(resp.url);
            const codeParam = urlObj.searchParams.get('code');

            url = urlObj.searchParams.delete('code');
            // Navigate to the new URL with the 'code' parameter
            if (codeParam) {
              this.router.navigate(['/peacekeeper-preselect'], { queryParams: { code: codeParam } });
            }
          }
          
        });
      }
    });
  }
}
