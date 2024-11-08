import { Component, OnInit } from '@angular/core';
import { LoginService } from '../common_service/login.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.css']
})
export class SuperAdminComponent  implements OnInit{

  getrequest:any[]=[];

    constructor(private role:LoginService){}

    ngOnInit(): void {
       this.getallrequest();
    }

    getallrequest(){
      this.role.getrolerequest().subscribe(data =>{
        console.log(data);
        this.getrequest = data;
      })
    }


  //   handleApproval(userid: string, approved: number) {
  //     const data = { userid, approved };
  //     console.log("view data",data)
  //     this.role.RoleChange(data).subscribe(response => {
  //         alert("Role Has been Changed.!!!")
  //     });
  // }

  handleApproval(userid: string, approved: number) {
    const data = { userid, approved };
    console.log("view data", data);
    
    this.role.RoleChange(data).subscribe(response => {
      if (data.approved === 1) {
        console.log("check approved",approved);
        Swal.fire('Request Approved','The user’s role has been successfully updated.','success');
        this.getallrequest();
      } else if (data.approved === 0) {
        Swal.fire('Request Rejected','The user’s request has been successfully deleted.','success');
        this.getallrequest();
      }
    });
  }
  


  
  
  
}
