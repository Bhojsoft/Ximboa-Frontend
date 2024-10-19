import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/common_service/auth-service.service';
import { StudentService } from 'src/app/common_service/student.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email:string='';
  password: string = '';
  message: string = '';
  show: boolean = false; 
  rememberMe: boolean = false;

  constructor(
    private loginService: StudentService,
    private route: Router,
    private authService: AuthServiceService,
  ) {}

  ngOnInit(): void {}

  onSubmit(token: string) {
    this.loginService.login(token).subscribe({
      next: (response: any) => { 
        // console.log(response);
        alert('Login Successful');
        sessionStorage.setItem("Authorization",response.token)
            this.route.navigate(['/student']);
        this.authService.login(response.token); // Set login state
      },
      error: () => { 
        this.message = 'An error occurred';
        alert("Invalid credentials. Please try again");
      }
    });
  }
 

  togglePassword() {
    this.show = !this.show;
  }

}
