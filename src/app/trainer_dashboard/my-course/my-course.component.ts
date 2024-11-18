import { Component, ViewChild, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AdminService } from 'src/app/common_service/admin.service';
import { AuthServiceService } from 'src/app/common_service/auth-service.service';
import { LoginService } from 'src/app/common_service/login.service';
import { StudentService } from 'src/app/common_service/student.service';
import { TrainerService } from 'src/app/common_service/trainer.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;


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
    this.getallcourses();
    this.admin.getcategorydata().subscribe( data =>{
      // console.log("data",data)
      this.showCategorydata = data;  
    });

    this.student.getstudentdatabyID().subscribe((result:any) =>{
      console.log("Show My course Data",result);
      this.showcoursedatastudent = result;      
    })
    

  }

  getallcourses(){
    this.service.gettrainerdatabyID().subscribe((result:any) =>{
      console.log("Show course Data",result);
      this.showcoursedata = result?.coursesWithFullImageUrl;
      });
  }

  onsubmit(): void {
    const formData = new FormData();
  
    for (const key of Object.keys(this.Courses) as (keyof typeof this.Courses)[]) {
      if (this.Courses.hasOwnProperty(key)) {
        if (key === 'tags' && Array.isArray(this.Courses[key])) {
          const tagsArray = this.Courses[key] as any[];
          const formattedTags = tagsArray.map(tag =>
            typeof tag === 'object' ? (tag.name || tag.toString()) : tag
          );
          formData.append('tags', formattedTags.join(','));
        } else {
          formData.append(key, this.Courses[key] as string);
        }
      }
    }
  
    if (this.thumbnail_image) {
      formData.append('thumbnail_image', this.thumbnail_image);
    }
  
    this.admin.postcoursesdata(formData).subscribe({
      next: (response) => {
        Swal.fire('Ohh...!', 'Course Added Successfully..!', 'success')
        this.getallcourses();
        bootstrap.Modal.getInstance(document.getElementById('AddcourseModal'))?.hide();
      },
      error: (error) => {
        console.error('Error', error);
        Swal.fire('Error', 'Please fill the details', 'error');
      }
    });
  }
  
  

 

   onFileSelected(event: any): void {
    this.thumbnail_image = event.target.files[0] || null;
  
   }
  
   showcourseName = false;
   truncatecourseName(name: string): string {
    return name.length > 18 ? name.slice(0, 12) + '...' : name;
  }


    onDelete(id: string): void {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this course? This action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!', cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.deleteCoursebyID(id).subscribe(
            response => {
              Swal.fire('Deleted!','The course has been deleted successfully.','success' );
              this.getallcourses();
            },
            error => {
              Swal.fire('Error!', 'An error occurred while deleting the course.','error');
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled','The course is safe :)', 'info');
        }
      });
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
