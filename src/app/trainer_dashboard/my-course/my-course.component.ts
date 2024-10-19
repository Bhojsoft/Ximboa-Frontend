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
    course_name:' ',
    category_id:' ',
    online_offline:' ',
    price:' ',
    offer_prize:' ',
    start_date:' ',
    end_date:' ',
    start_time:' ',
    end_time:' ',
    tags:' ',
    course_information:' ',
    course_brief_info:' ',
    thumbnail_image:' ',
    gallary_image:' ',
    trainer_materialImage:' ',
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
    for (const key in this.Courses) {
      if (this.Courses.hasOwnProperty(key)) {
        formData.append(key, (this.Courses as any)[key]);
      }
    }
    if (this.thumbnail_image) {
      formData.append('thumbnail_image', this.thumbnail_image);
    }

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
        console.error("Error", error);
        Swal.fire('Error', 'Please fill the datails', 'error');
      }
    }); 
   }

   onFileSelected(event: any): void {
    this.thumbnail_image = event.target.files[0] || null;
  
    // Ensure thumbnail_image is not null before proceeding
    if (this.thumbnail_image) {
      // File Size Check
      if (this.thumbnail_image.size > this.maxSize) {
        alert('File size exceeds 5MB.');
        return;
      }
  
      // Check Image Dimensions
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = () => {
          const width = image.width;
          const height = image.height;
  
          if (width > this.maxWidth || height > this.maxHeight) {
            alert(`Image dimensions exceed ${this.maxWidth}x${this.maxHeight}px.`);
          } else {
            // Proceed with upload or further operations
            console.log('Image is valid. Proceed with upload.');
          }
        };
      };
  
      reader.readAsDataURL(this.thumbnail_image);  // No error, since thumbnail_image is checked
    } else {
      alert('No image file selected.');
    }
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
