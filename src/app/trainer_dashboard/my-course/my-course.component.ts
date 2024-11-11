import { Component, ViewChild, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AdminService } from 'src/app/common_service/admin.service';
import { AuthServiceService } from 'src/app/common_service/auth-service.service';
import { LoginService } from 'src/app/common_service/login.service';
import { StudentService } from 'src/app/common_service/student.service';
import { TrainerService } from 'src/app/common_service/trainer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-course',
  templateUrl: './my-course.component.html',
  styleUrls: ['./my-course.component.css']
})
export class MyCourseComponent implements OnInit {

  isUser: boolean = true; // Example default value; adjust as needed
  isTrainer: boolean = false;
  isSELF_EXPERT: boolean = false;
  isInstitute : boolean = false;
  isAdmin : boolean = false;

  maxSize = 5 * 1024 * 1024; // 5MB
  maxWidth = 100; // Maximum width in pixels
  maxHeight = 100;


  checkUserRole() {
    const role = this.auth.getUserRole();
    // console.log(role);
    this.isTrainer = role === 'TRAINER';
    this.isSELF_EXPERT = role === 'SELF_EXPERT';
    this.isInstitute = role === 'INSTITUTE';
    this.isAdmin = role === 'SUPER_ADMIN';
    this.isUser = role === 'USER'  || role === 'TRAINER' || role === 'SELF_EXPERT' || role === 'INSTITUTE' || role === 'SUPER_ADMIN' ;
  }


  showIcon = false;
  toggleIcon() {
    this.showIcon = !this.showIcon;
  }
  showCategorydata:any;
  showcoursedata:any;
  showcoursedatastudent:any[]=[];
  

  thumbnail_image: File | null = null;

  Courses = {
    course_name:'',
    category_id:'',
    online_offline:'',
    price:'',
    offer_prize:'',
    start_date:'',
    end_date:'',
    start_time:'',
    end_time:'',
    tags:[],
    course_information:'',
    course_brief_info:'',
    thumbnail_image:'',
    gallary_image:'',
    trainer_materialImage:'',
  };

  constructor(private admin:AdminService, 
    private service:TrainerService,
    private auth: AuthServiceService ,
     private student:StudentService,
    private cookie:CookieService){}

  ngOnInit(): void{
    this.checkUserRole();
    this.service.gettrainerdatabyID().subscribe((result:any) =>{
      console.log("Show course Data",result);
      this.showcoursedata = result?.coursesWithFullImageUrl;
      })

    this.admin.getcategorydata().subscribe( data =>{
      // console.log("data",data)
      this.showCategorydata = data;  
    });

    this.student.getstudentdatabyID().subscribe((result:any) =>{
      console.log("Show My course Data",result);
      this.showcoursedatastudent = result;      
    })
    

  }

  onsubmit(): void {
    const formData = new FormData();
  
    // Loop through the keys of the Courses object
    for (const key of Object.keys(this.Courses) as (keyof typeof this.Courses)[]) {
      if (this.Courses.hasOwnProperty(key)) {
        // Check if the key is 'tags' and handle it as an array
        if (key === 'tags' && Array.isArray(this.Courses[key])) {
          // Join the tags array into a single string, with a delimiter (e.g., comma)
          formData.append('tags', (this.Courses[key] as string[]).join(','));
        } else {
          // For all other fields, append them as string values
          formData.append(key, this.Courses[key] as string);
        }
      }
    }
  
    // Append the thumbnail image if it exists
    if (this.thumbnail_image) {
      formData.append('thumbnail_image', this.thumbnail_image);
    }
  
    // Post the form data
    this.admin.postcoursesdata(formData).subscribe({
      next: (response) => {
        Swal.fire('Ohh...!', 'Course Added Successfully..!', 'success').then(() => {
          // Close the modal
          const modalCloseButton = document.querySelector('.btn-secondary[data-bs-dismiss="modal"]') as HTMLElement;
          if (modalCloseButton) {
            modalCloseButton.click();
          }
          window.location.reload();
        });
      },
      error: (error) => {
        console.error('Error', error);
        Swal.fire('Error', 'Please fill the details', 'error');
      }
    });
  }
  
  

  //   onsubmit(): void {
      
  //   const formData = new FormData();
  //   for (const key in this.Courses) {
  //     if (this.Courses.hasOwnProperty(key)) {
  //       formData.append(key, (this.Courses as any)[key]);
  //     }
  //   }
  //   if (this.thumbnail_image) {
  //     formData.append('thumbnail_image', this.thumbnail_image);
  //   }

  //   this.admin.postcoursesdata(formData).subscribe({
  //     next: (response) => {
  //       Swal.fire('Ohh...!', 'Course Added Successfully..!', 'success').then(() => {
  //               // Close the modal
  //               const modalCloseButton = document.querySelector('.btn-secondary[data-bs-dismiss="modal"]') as HTMLElement;
  //               if (modalCloseButton) {
  //                 modalCloseButton.click();
  //               }
  //               window.location.reload();               
  //             });
  //     },
  //     error: (error) => {
  //       console.error("Error", error);
  //       Swal.fire('Error', 'Please fill the datails', 'error');
  //     }
  //   }); 
  //  }

   onFileSelected(event: any): void {
    this.thumbnail_image = event.target.files[0] || null;
  
   }
  
    

    onDelete(id: string): void {
      this.service.deleteCoursebyID(id).subscribe(
        response => {
          // console.log('Data deleted successfully', response);
          alert("Course deleted successfully");
          window.location.reload();
        },
        error => {
          // console.error('Error deleting data', error);
          alert("Error");
        }
      );
    }


      // conver Rupees K or laks
  getFormattedPrice(price: number): string {
    if (price >= 100000) {
      return '₹' + (price / 100000).toFixed(1) + 'L';  // For lakhs
    } else if (price >= 1000) {
      return '₹' + (price / 1000).toFixed(1) + 'K';  // For thousands
    } else {
      return '₹' + price.toString();  // For rupees
    }
  }
}
