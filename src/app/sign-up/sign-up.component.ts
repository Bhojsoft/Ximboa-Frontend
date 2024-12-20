import { Component, OnInit } from '@angular/core';
import { LoginService } from '../common_service/login.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthServiceService } from '../common_service/auth-service.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

 
 password: string='';
  rememberMe: boolean = false;

   userData= {
      f_Name:'',
      middle_Name:'',
      l_Name:'',
      email_id:' ',
      password:'',
      mobile_number:' ',

  }
  constructor(private loginservices:LoginService,private route:Router,private authService:AuthServiceService){ }

  ngOnInit() {}

  onSubmit(form: NgForm) {
    if (form.valid && this.rememberMe) {
      // Submit form if valid and checkbox is checked
      this.loginservices.postsignupdata(this.userData).subscribe({
        next: (response) => {
          sessionStorage.setItem("Authorization", response.token);
          this.authService.login(response.token); // Set login state
          Swal.fire(
            'Congratulations',
            'Welcome to Ximbo! <br> We’re thrilled to have you join our community of esteemed trainers, coaches, and educators. Ximbo is designed to empower you with the tools and resources needed to deliver exceptional training and create impactful learning experiences. <br> You have registered successfully!',
            'success'
          );
          this.route.navigate(['/trainer']);
        },
        error: (error) => {
          Swal.fire('Error', 'Please enter valid details.', 'error');
        },
      });
    } else if (!this.rememberMe) {
      // Show error if checkbox is unchecked
      Swal.fire('Error', 'You must accept the Terms & Conditions to submit the form.', 'error');
    } else {
      console.log('Form is invalid');
    }
  }
  
  // Hide And Show Password Logic
  show: boolean = false;
  togglePassword() {
    this.show = !this.show;
  }
}
