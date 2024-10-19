

// sign-in.component.ts
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../common_service/login.service';
import {  Router } from '@angular/router';
import { AuthServiceService } from '../common_service/auth-service.service';
import Swal from 'sweetalert2';
import { jwtDecode } from "jwt-decode";
declare var bootstrap: any;


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
    
  email_id: string = '';
  password: string = '';
  message: string = '';
  show: boolean = false; 
  rememberMe: boolean = false;
   token = "";
   decoded:any;


  constructor(
    private loginService: LoginService,
    private router: Router,
    private authService: AuthServiceService,
    private route:Router
  ) {}

  ngOnInit(): void {

    // console.log(this.decoded);

  }

  

  onSubmit(token: string) {
    
    this.loginService.login(token).subscribe({
      next: (response: any) => { 
        sessionStorage.setItem("Authorization",response.token);
            this.route.navigate(['/trainer']);
            this.authService.login(response.token); // Set login state
        Swal.fire('','We’re excited to see you again. Your login was successful, and you’re now ready to continue creating amazing learning experiences.', 'success');
      },
      error: () => { 
        this.message = 'An error occurred';
        //alert("Invalid credentials. Please try again");
        Swal.fire('Error', 'Please Enter Valid Details.', 'error');

      }
    });
  }

  forget = {
    email_id:' ',
  }

  forgotpwd() {
    this.loginService.forgotpassword(this.forget).subscribe({
      next: (response: any) => { 
        Swal.fire('', 'Password Reset Link on your Email ID', 'success');  
        // this.ngAfterViewInit();
      },
      error: () => { 
        this.message = 'An error occurred';
        Swal.fire('Error', 'Please Enter Valid Details.', 'error');
      }
    });
  }
  

  togglePassword() {
    this.show = !this.show;
  }


  // closeModal() {
  //   const modalElement = document.getElementById('forgotpwd');
  //   const modalInstance = bootstrap.Modal.getInstance(modalElement); // Returns a Bootstrap modal instance
  //   if (modalInstance) {
  //     modalInstance.hide(); // Hides the modal
  //     modalInstance.dispose();
  //   }
  // }

  
  
  

}
