import { Component, OnInit } from '@angular/core';
import { LoginService } from '../common_service/login.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.css']
})
export class SuperAdminComponent  implements OnInit{

  id:any;
  getrequest:any[]=[];
  getapprovedrequest:any;
  getRejectedrequest:any;
  UserDetailsinfo:any;

    constructor(private role:LoginService,private router:ActivatedRoute)
    {}

    ngOnInit(): void {

      this.router.paramMap.subscribe(params => {
        this.id = params.get('id');
        if (this.id) {
          this.UserDetails(); // Fetch user details when 'id' is available
        }
      });

       this.getallrequest();

       this.role.getroleApprovedrequest().subscribe(result =>{
          this.getapprovedrequest = result.data;
          console.log(result,"approved"); 
       });

       this.role.getRejectRequest().subscribe(result =>{
        this.getRejectedrequest = result.data;
        console.log(result,"Rejected"); 
     });


    }

    getallrequest(){
      this.role.getrolerequest().subscribe(data =>{
        console.log(data,"request");
        this.getrequest = data.data;
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
  

UserDetails() {
    if (this.id) {
      this.role.getuserdetail(this.id).subscribe(result => {
        this.UserDetailsinfo = result;
        console.log("User Details:", this.UserDetailsinfo);
      });
    }
  }
  
  openUserDetailsModal(userId: string): void {
    this.role.getuserdetail(userId).subscribe(result => {
      this.UserDetailsinfo = result;
      console.log("Fetched User Details:", this.UserDetailsinfo); // Debugging
    });
  }
  
  
}
