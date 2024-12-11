import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AdminService } from 'src/app/common_service/admin.service';
import { AuthServiceService } from 'src/app/common_service/auth-service.service';
import { DashboardService } from 'src/app/common_service/dashboard.service';
import { LoginService } from 'src/app/common_service/login.service';
import { StudentService } from 'src/app/common_service/student.service';
import { TrainerService } from 'src/app/common_service/trainer.service';
import Swal from 'sweetalert2';
import imageCompression from 'browser-image-compression';


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
  isInstitute: boolean = false;
  isAdmin: boolean = false;



  Showcoursedetails: any;
  id: any;

  starsArray = Array(5).fill(0);


  checkUserRole() {
    const role = this.auth.getUserRole();
    // console.log(role);
    this.isTrainer = role === 'TRAINER';
    this.isSELF_EXPERT = role === 'SELF_EXPERT';
    this.isInstitute = role === 'INSTITUTE';
    this.isAdmin = role === 'SUPER_ADMIN';
    this.isUser = role === 'USER' || role === 'TRAINER' || role === 'SELF_EXPERT' || role === 'INSTITUTE' || role === 'SUPER_ADMIN';
  }


  showIcon = false;
  toggleIcon() {
    this.showIcon = !this.showIcon;
  }
  showCategorydata: any;
  showcoursedata: any;
  showcoursedatastudent: any[] = [];
  showpendingCourses: any;


  thumbnail_image: File | null = null;
  compressedFile?: File;
  imageObjectURL: string | null = null; 
  maxFileSizeMB: number = 5;
  allowedFileTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png']; 




  Courses = {
    course_name: '',
    category_id: '',
    sub_category: '',
    online_offline: '',
    price: '',
    offer_prize: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    tags: [],
    course_information: '',
    course_brief_info: '',
    thumbnail_image: '',
    gallary_image: '',
    trainer_materialImage: '',
  };

  constructor(private admin: AdminService,
    private service: TrainerService,
    private auth: AuthServiceService,
    private student: StudentService,
    private router: ActivatedRoute,
    private Admin: AdminService,
    private dashboard: DashboardService,
    private cookie: CookieService) { }

  ngOnInit(): void {
    this.checkUserRole();
    this.getallcourses();
    this.getPendingCourses();

    this.router.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.CourseDetails(); // Fetch user details when 'id' is available
      }
    });

    this.dashboard.getcategoryname().subscribe(data => {
      console.log("data", data)
      this.showCategorydata = data;
    });

    this.student.getstudentdatabyID().subscribe((result: any) => {
      console.log("Show My course Data", result);
      this.showcoursedatastudent = result;
    })


  }

  getallcourses() {
    this.service.GetCoursesbyTrainerID().subscribe((result: any) => {
      console.log("Show course Data", result);
      this.showcoursedata = result?.coursesWithFullImageUrl;
    });
  }

  getPendingCourses() {
    this.service.getAllCourseRequest().subscribe(response => {
      console.log("requested courses", response);
      this.showpendingCourses = response.data;
    })
  }

  CourseDetails() {
    if (this.id) {
      this.service.ViewRequestCoursebyID(this.id).subscribe(result => {
        this.Showcoursedetails = result;
        console.log("User Details:", this.Showcoursedetails);
      });
    }
  }

  openCourseDetailsModal(userId: string): void {
    this.service.ViewRequestCoursebyID(userId).subscribe(result => {
      this.Showcoursedetails = result;
      console.log("User Details:", this.Showcoursedetails);
    });
  }

  handleCourseApproval(Courseid: string, Status: string) {
    if (Status === 'rejected') {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to reject this Course? This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, reject it',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.CourserequestchangeStatus(Courseid, Status).subscribe(
            (response) => {
              this.getPendingCourses();
              Swal.fire('Request Rejected', 'The Trainer Course request Status has been successfully Rejected.', 'success');
            },
            (error) => {
              Swal.fire('Error', 'Failed to reject the request. Please try again later.', 'error');
            }
          );
        }
      });
    } else if (Status === 'approved') {
      this.service.CourserequestchangeStatus(Courseid, Status).subscribe(
        (response) => {
          this.getPendingCourses();
          Swal.fire('Request Approved', 'The Trainer Course Status has been successfully updated.', 'success');
        },
        (error) => {
          Swal.fire('Error', 'Failed to approve the request. Please try again later.', 'error');
        }
      );
    }
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

  async onFileSelected(event: any): Promise<void> {
    const file = event.target.files[0];
    
    if (!file) return;
  
    if (file.size > this.maxFileSizeMB * 1024 * 1024) {
      Swal.fire('File Too Large', `The file is too large. Please upload an image smaller than ${this.maxFileSizeMB} MB.`, 'error');
      return;
    }
  
    if (!this.allowedFileTypes.includes(file.type)) {
      Swal.fire('Invalid Format', 'Unsupported file format. Please upload a JPG, JPEG, or PNG image.', 'error');
      return;
    }
  
    try {
      const compressionOptions = {
        maxSizeMB: 5,
        maxWidthOrHeight: 1000,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, compressionOptions);
  
      // Convert to AVIF or WebP
      const convertedFile = await this.convertImageFormat(compressedFile, 'image/webp'); // Change to 'image/avif' for AVIF format
  
      console.log('Original file size:', file.size / 1024 / 1024, 'MB');
      console.log('Compressed file size:', compressedFile.size / 1024 / 1024, 'MB');
      console.log('Converted file size:', convertedFile.size / 1024 / 1024, 'MB');
  
      this.thumbnail_image = convertedFile;
  
      // Preview the new image
      this.imageObjectURL = URL.createObjectURL(convertedFile);
  
    } catch (error) {
      console.error('Error during compression or conversion:', error);
      Swal.fire('Error', 'There was an error processing the image. Please try again.', 'error');
    }
  }
  
 
  async convertImageFormat(file: File, format: string): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
  
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, '') + `.${format.split('/')[1]}`, {
                  type: format,
                  lastModified: Date.now(),
                });
                resolve(newFile);
              } else {
                reject(new Error('Canvas conversion failed.'));
              }
            },
            format, 0.9);
        };
        img.onerror = (err) => {
          reject(new Error('Error loading image for conversion: ' + err));
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = (err) => {
        reject(new Error('Error reading file: ' + err));
      };
      reader.readAsDataURL(file);
    });
  }

 

  showcourseName = false;
  truncatecourseName(name: string): string {
    return name.length > 18 ? name.slice(0, 12) + '...' : name;
  }

  showcourse1Name = false;
  truncatecourseName1(name: string): string {
    return name.length > 18 ? name.slice(0, 12) + '...' : name;
  }

  showbusinessName = false;
  trunbusinessName(name: string): string {
    return name.length > 18 ? name.slice(0, 13) + '...' : name;
  }
  showbusiness1Name = false;
  trunbusiness1Name(name: string): string {
    return name.length > 18 ? name.slice(0, 13) + '...' : name;
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
            Swal.fire('Deleted!', 'The course has been deleted successfully.', 'success');
            this.getallcourses();
          },
          error => {
            Swal.fire('Error!', 'An error occurred while deleting the course.', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'The course is safe :)', 'info');
      }
    });
  }

  subCategory: any = []; // Holds the subcategory data
  fetchcategoryID: string = ''; // Holds the selected category ID

  getsubcategory(): void {
    if (this.fetchcategoryID) {
      this.Admin.getsubcategorybyCategoryID(this.fetchcategoryID).subscribe(result => {
        this.subCategory = result.data || [];
      });
    } else {
      this.subCategory = []; // Clear subcategory data if no category selected
    }
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
