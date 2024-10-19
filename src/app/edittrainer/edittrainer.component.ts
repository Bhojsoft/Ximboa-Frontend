import { Component, OnInit } from '@angular/core';
import { TrainerService } from '../common_service/trainer.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthServiceService } from '../common_service/auth-service.service';


@Component({
  selector: 'app-edittrainer',
  templateUrl: './edittrainer.component.html',
  styleUrls: ['./edittrainer.component.css']
})
export class EdittrainerComponent implements OnInit {

  isTrainer: boolean = false;
  isUser: boolean = false;
  isAdmin: boolean = false;



  currentRow = 0;
  myForm!: FormGroup;
  id: any;
  Showtrainerdetails:any;

  social = {

    facebook:' ',
    instagram :' ',
    youtube:' ',
    Linkdein:' ',
  }

  education = {
      school: '',
      college: '',
      degree: '',
      university: '',
      other_details: '',
      achievements: '',
  }

  about ={
    about_us:'',
    our_services:''
  }

  Testimonial = {
    Testimonial_Description:'',
      Testimonial_Title:'',
  }


  // selectedFiles: File[] = [];
  selectedFiles: any[] = [];


  constructor(private service:TrainerService,private router:ActivatedRoute,private fromb:FormBuilder,private auth:AuthServiceService)
      { this.id=this.router.snapshot.paramMap.get('id');  }

      onFileSelected(event: any) {
          this.selectedFiles = event.target.files;
      }


      checkUserRole() {
        const role = this.auth.getUserRole();
        console.log('User Role:', role);
    
        this.isAdmin = role === 'SUPER_ADMIN';
        this.isTrainer = role === 'TRAINER';
        this.isUser = role === 'USER' || role === 'TRAINER' || role === 'SUPER_ADMIN';
    
        console.log('isTrainer:', this.isTrainer, 'isUser:', this.isUser, 'isAdmin:', this.isAdmin);
      }


    ngOnInit(): void {
      this.checkUserRole();
          this.myForm = this.fromb.group({
            f_Name:[' '],
            l_Name:[' '],
            email_id : [' '],
            mobile_number : [' '],
            trainer_image: [''],
            date_of_birth: [''],
            whatsapp_no:[''],
            address1: [''],
            address2: [''],
            city: [''],
            country: [''],
            state: [''],
            pincode: [''],
          });

          this.service.gettrainerbyID().subscribe((data:any)=>{
              console.log("trainer Details",data);
              this.myForm.patchValue({
                f_Name:data.f_Name,
                l_Name:data.l_Name,
                email_id : data.email_id,
                mobile_number : data.mobile_number,
                date_of_birth: data.date_of_birth,
                whatsapp_no:data.whatsapp_no,
                address1: data.address1,
                address2: data.address2,
                city: data.city,
                country: data.country,
                state: data.state,
                pincode: data.pincode,
              });
        });
    }

    onSubmit(){
      const formData = new FormData();
      formData.append("f_Name",this.myForm.get("f_Name")?.value);
      formData.append("l_Name",this.myForm.get("l_Name")?.value);
      formData.append("email_id",this.myForm.get("email_id")?.value);
      formData.append("mobile_number",this.myForm.get("mobile_number")?.value);
      formData.append("date_of_birth",this.myForm.get("date_of_birth")?.value);
      formData.append("whatsapp_no",this.myForm.get("whatsapp_no")?.value);
      formData.append("address1",this.myForm.get("address1")?.value);
      formData.append("address2",this.myForm.get("address2")?.value);
      formData.append("city",this.myForm.get("city")?.value);
      formData.append("country",this.myForm.get("country")?.value);
      formData.append("state",this.myForm.get("state")?.value);
      formData.append("pincode",this.myForm.get("pincode")?.value);

      this.service.updatetrainerDetails(formData).subscribe({
        next: response => {
          console.log(response);
          alert("Data Updated");
        },
        error: error => {
          console.log(error);
          alert("Error");

        }
      });
    }

  // ***************************  POST DATA SOCILA MIDEA *********************

        onSave() {
          const socialdata = {
            facebook:this.social.facebook,
            instagram :this.social.instagram,
            youtube:this.social.youtube,
            Linkdein:this.social.Linkdein,
          };
        
          this.service.postSocialLinks(socialdata).subscribe({
            next: (response) => {
              Swal.fire('Ohh...!', 'Links Added Successfully..!', 'success');
              // window.location.reload();
            },
            error: (error) => {
              console.error("Error", error);
              Swal.fire('Error', 'Please fill the details', 'error');
            }
          });
        }


// ***************************  POST DATA Education Details *********************
      onEducation() {
        const educationdetails = {
          school:this.education.school,
          college:this.education.college,
          degree:this.education.degree,
          university:this.education.university,
          other_details:this.education.other_details,
          achievements:this.education.achievements,
        };

        this.service.postEducation(educationdetails).subscribe({
          next: (response) => {
            Swal.fire('Ohh...!', 'Education Details Added Successfully..!', 'success');
            // window.location.reload();
          },
          error: (error) => {
            console.error("Error", error);
            Swal.fire('Error', 'Please fill the details', 'error');
          }
        });
      }

// ***************************  POST ABOUT US DATA *********************
      onabout(){
        const aboudata = {
          about_us: this.about.about_us,
          our_services: this.about.our_services,
        }
        this.service.postabout(aboudata).subscribe({
          next: (response) => {
            Swal.fire('Ohh...!', 'Data Added Successfully..!', 'success');
            // window.location.reload();
          },
          error: (error) => {
            console.error("Error", error);
            Swal.fire('Error', 'Please fill the details', 'error');
          }
        });
      }

// ***************************  POST DATA Testimonial Details *********************
    ontestimonials(){
      const test ={
        Testimonial_Description: this.Testimonial.Testimonial_Description,
       Testimonial_Title: this.Testimonial.Testimonial_Title,
      }
      this.service.posttestimonial(test).subscribe({
        next: (response) => {
          Swal.fire('Ohh...!', 'Data Added Successfully..!', 'success');
          // window.location.reload();
        },
        error: (error) => {
          console.error("Error", error);
          Swal.fire('Error', 'Please fill the details', 'error');
        }
      });

    }

  // ***************************  POST DATA Education Details *********************
      onGallary(): void {
        const formData = new FormData();
        
        for (let i = 0; i < this.selectedFiles.length; i++) {
          formData.append('photos', this.selectedFiles[i]); 
        }
          this.service.postgallary(formData).subscribe(
          (response) => {
            // console.log('Upload successful', response);
            Swal.fire('Ohh...!', 'Photos Added Successfully..!', 'success');
          },
          
          (error) => {
            // console.error('Upload failed', error);
            Swal.fire('Error', 'Please fill the details', 'error');
          }
        );
      }
  
    


  nextRow() {
    if (this.currentRow < 2) {
      this.currentRow++;
    }
  }

  previousRow() {
    if (this.currentRow > 0) {
      this.currentRow--;
    }
  }

}
