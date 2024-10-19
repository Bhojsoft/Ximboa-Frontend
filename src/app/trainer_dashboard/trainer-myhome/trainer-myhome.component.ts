import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/common_service/dashboard.service';
import { Router } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-trainer-myhome',
  templateUrl: './trainer-myhome.component.html',
  styleUrls: ['./trainer-myhome.component.css']
})
export class TrainerMyhomeComponent implements OnInit  {
  showDashboardata:any;

  constructor(private service:DashboardService,private router: Router,private http:HttpClient){}

   ngOnInit(): void {
       this.service. getDashboardData().subscribe(result => {
        console.log(result);
        
        this.showDashboardata=result;
       })


   }

   fetchUserProfile(token:string) {
    const apiUrl = 'http://localhost:1000/api/linkedin/userinfo';
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Set the authorization header
      'Content-Type': 'application/json' // Set content type
    });
   this.http.get(apiUrl,{headers}).subscribe((responspe:any)=>
    {console.log(responspe)},(error)=>{console.error('Error fetching profile', error);});  
   
  }
}
