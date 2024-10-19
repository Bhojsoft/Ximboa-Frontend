import { Component, OnInit } from '@angular/core';
import { LoginService } from '../common_service/login.service';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.css']
})
export class SuperAdminComponent  implements OnInit{

  getrequest:any[]=[];

    constructor(private role:LoginService){}

    ngOnInit(): void {
        this.role.getrolerequest().subscribe(data =>{
          console.log(data);
          this.getrequest = data;
        })
    }

    handleApproval(userid: string, approved: number) {
      const data = { userid, approved };
      console.log("view data",data)
      this.role.RoleChange(data).subscribe(response => {
          alert("Role Has been Changed.!!!")
          // window.location.reload();
      });
  }
  
  
}
