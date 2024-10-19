import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from 'src/app/common_service/student.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-student-register',
  templateUrl: './student-register.component.html',
  styleUrls: ['./student-register.component.css']
})
export class StudentRegisterComponent implements OnInit {

  
  showPassword: boolean = false;
  show: boolean = false; 
  rememberMe: boolean = false;
  password: string = '';
  terms:any;

  

   userData= {
    id:' ',
    name:' ',
    email:' ',
    password:' ',
    mobile_no:' ',

  }
  constructor(private loginservices:StudentService,private route:Router){ }

      ngOnInit() { }

      onSubmit(form: NgForm) {
        if (form.valid) {
          this.loginservices.postsignupdata(this.userData).subscribe({
            next: (response) => {
              // console.log(alert("Success"),response);
              Swal.fire('Congratulation', 'You Hava Register successfully!', 'success');
              this.route.navigate(['/signin'])
            },
            error: (error)=>{
              // console.log(alert("Error"),error);
              Swal.fire('Error', 'Please Enter Valid Details.', 'error');

            } 
          });
        } else {
          console.log('Form is invalid');
        }
      }

       // Hide And Show Password Logic
       togglePassword() {
        this.show = !this.show;
      }


}
