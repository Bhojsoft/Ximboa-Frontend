import { Component, OnInit } from '@angular/core';
import { TrainerService } from '../common_service/trainer.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthServiceService } from '../common_service/auth-service.service';
import imageCompression from 'browser-image-compression';



@Component({
  selector: 'app-edittrainer',
  templateUrl: './edittrainer.component.html',
  styleUrls: ['./edittrainer.component.css']
})
export class EdittrainerComponent implements OnInit {

  items = [];

  isTrainer: boolean = false;
  isUser: boolean = false;
  isAdmin: boolean = false;
  isInstitute: boolean = false;
  isSELF_EXPERT: boolean = false


  currentRow = 0;
  myForm!: FormGroup;
  SocialForm!: FormGroup;
  EducationForm!: FormGroup;
  AboutusForm!: FormGroup;
  id: any;
  Showtrainerdetails: any;


  skills = {
    skills: '',
  }

  Testimonial = {
    Testimonial_Description: '',
    Testimonial_Title: '',
    Testimonial_Autor_Name: '',
  }


  selectedFiles: File[] = [];
  compressedFiles: File[] = [];
  imageObjectURLs: string[] = [];
  maxFileSizeMB: number = 5;
  allowedFileTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png'];


  onCheckboxChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      const mobileNumber = this.myForm.get('mobile_number')?.value;
      this.myForm.get('whatsapp_no')?.setValue(mobileNumber);
    } else {
      this.myForm.get('whatsapp_no')?.setValue('');
    }
  }


  constructor(private service: TrainerService, private router: ActivatedRoute, private fromb: FormBuilder, private auth: AuthServiceService) { this.id = this.router.snapshot.paramMap.get('id'); }


  checkUserRole() {
    const role = this.auth.getUserRole();
    console.log('User Role:', role);
    this.isAdmin = role === 'SUPER_ADMIN';
    this.isTrainer = role === 'TRAINER';
    this.isInstitute = role === 'INSTITUTE';
    this.isSELF_EXPERT = role == 'SELF_EXPERT';
    this.isUser = role === 'USER' || role === 'TRAINER' || role === 'SUPER_ADMIN' || role === 'INSTITUTE' || role === 'SELF_EXPERT';
    console.log('isTrainer:', this.isTrainer, 'isUser:', this.isUser, 'isAdmin:', this.isAdmin, this.isInstitute, this.isSELF_EXPERT);
  }


  ngOnInit(): void {
    this.checkUserRole();

    this.myForm = this.fromb.group({
      f_Name: [''],
      l_Name: [''],
      email_id: [''],
      mobile_number: [''],
      trainer_image: [''],
      date_of_birth: [''],
      whatsapp_no: [''],
      address1: [''],
      address2: [''],
      city: [''],
      country: [''],
      state: [''],
      pincode: [''],
    });

    this.service.gettrainerbyID().subscribe((data: any) => {
      console.log("trainer Details", data);
      this.myForm.patchValue({
        f_Name: data.f_Name,
        l_Name: data.l_Name,
        email_id: data.email_id,
        mobile_number: data.mobile_number,
        date_of_birth: data.date_of_birth,
        whatsapp_no: data.whatsapp_no,
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        country: data.country,
        state: data.state,
        pincode: data.pincode,
      });
    });

    this.SocialForm = this.fromb.group({
      Linkdein: [''],
      facebook: [''],
      instagram: [''],
      youtube: [''],
      website: [''],
    });

    this.service.GetUserSocialMidiabyID().subscribe((SocialMidia: any) => {
      this.SocialForm.patchValue({
        Linkdein: SocialMidia.Linkdein,
        facebook: SocialMidia.facebook,
        instagram: SocialMidia.instagram,
        youtube: SocialMidia.youtube,
        website: SocialMidia.website,
      });
    });

    this.EducationForm = this.fromb.group({
      school: [''],
      college: [''],
      degree: [''],
      university: [''],
      other_details: [''],
      achievements: [''],
    });

    this.service.GetEducationbyID().subscribe((Education: any) => {
      this.EducationForm.patchValue({
        school: Education.school,
        college: Education.college,
        degree: Education.degree,
        university: Education.university,
        other_details: Education.other_details,
        achievements: Education.achievements,
      });
    });


    this.AboutusForm = this.fromb.group({
      about_us: [''],
      our_services: [''],
    });

    this.service.GetAboutUSbyID().subscribe((AboutUS: any) => {
      this.AboutusForm.patchValue({
        about_us: AboutUS.about_us,
        our_services: AboutUS.our_services,
      });
    });

  }

  // ***************************  POST DATA/UPDATE Trainer Personal Details MIDEA *********************
  onSubmit() {
    this.myForm.markAllAsTouched();
    if (this.myForm.valid) {
      const formData = new FormData();
      formData.append("f_Name", this.myForm.get("f_Name")?.value);
      formData.append("l_Name", this.myForm.get("l_Name")?.value);
      formData.append("email_id", this.myForm.get("email_id")?.value);
      formData.append("mobile_number", this.myForm.get("mobile_number")?.value);
      formData.append("date_of_birth", this.myForm.get("date_of_birth")?.value);
      formData.append("whatsapp_no", this.myForm.get("whatsapp_no")?.value);
      formData.append("address1", this.myForm.get("address1")?.value);
      formData.append("address2", this.myForm.get("address2")?.value);
      formData.append("city", this.myForm.get("city")?.value);
      formData.append("country", this.myForm.get("country")?.value);
      formData.append("state", this.myForm.get("state")?.value);
      formData.append("pincode", this.myForm.get("pincode")?.value);

      this.service.updatetrainerDetails(formData).subscribe({
        next: response => {
          console.log(response);
          Swal.fire('Ohh...!', 'Your profile has been updated successfully..!', 'success');
        },
        error: error => {
          console.log(error);
          Swal.fire('Error...!', 'Soory.! Some Technical issue try after Some Time.', 'error');
        }
      });
    }

  }

  // ***************************  POST DATA/UPDATE SOCILA MIDEA *********************
  onSubmitSocialMidea() {
    if (this.SocialForm.valid) {

      const formValues = this.SocialForm.value;

      console.log("social form data", formValues);

      this.service.postSocialLinks(formValues).subscribe({
        next: (response) => {
          Swal.fire('Ohh...!', 'Links Added Successfully..!', 'success');
        },
        error: (error) => {
          console.error("Error", error);
          Swal.fire('Error', 'Please fill the details', 'error');
        }
      });
    }
  }

  // ***************************  POST/UPDATE DATA Education Details *********************
  onEducation() {
    if (this.EducationForm.valid) {
      const EducationformValues = this.EducationForm.value;
      console.log("Education data", EducationformValues);
      this.service.postEducation(EducationformValues).subscribe({
        next: (response) => {
          Swal.fire('Ohh...!', 'Education Details Added Successfully..!', 'success');
        },
        error: (error) => {
          Swal.fire('Error', 'Please fill the details', 'error');
        }
      });
    }
  }

  // ***************************  POST/UPDATE SKILLS DATA *********************
  onabout() {
    if (this.AboutusForm.valid) {
      const formValues = this.AboutusForm.value;
      this.service.postabout(formValues).subscribe({
        next: (response) => {
          Swal.fire('Ohh...!', 'Data Added Successfully..!', 'success');
        },
        error: (error) => {
          Swal.fire('Error', 'Please fill the details', 'error');
        }
      });
    }
  }

  // ***************************  POST/UPDATE SKILLS DATA *********************

  AddSkills() {
    const skillsArray = Array.isArray(this.skills.skills)
      ? this.skills.skills.map((skill: any) => skill.value)
      : [];

    console.log(skillsArray);

    if (skillsArray.length > 0) {
      const dataToSend = { skills: skillsArray };
      this.service.postskills(dataToSend).subscribe({
        next: (response) => {
          console.log("Response from API:", response);
          Swal.fire('Success!', 'Skills Added Successfully!', 'success');
        },
        error: (error) => {
          console.error("Error", error);
          Swal.fire('Error', 'An error occurred while saving skills.', 'error');
        }
      });
    } else {
      Swal.fire('Error', 'Please fill in at least one skill.', 'error');
    }
  }

  // ***************************  POST/UPDATE DATA Testimonial Details *********************

  ontestimonials(form: NgForm) {
    if (form.valid) {
      const test = {
        Testimonial_Description: this.Testimonial.Testimonial_Description,
        Testimonial_Title: this.Testimonial.Testimonial_Title,
        Testimonial_Autor_Name: this.Testimonial.Testimonial_Autor_Name,
      };

      this.service.posttestimonial(test).subscribe({
        next: (response) => {
          Swal.fire('Ohh...!', 'Data Added Successfully..!', 'success');
          this.Testimonial = {
            Testimonial_Description: '',
            Testimonial_Title: '',
            Testimonial_Autor_Name: ''
          };
          form.reset();
        },
        error: (error) => {
          console.error("Error", error);
          Swal.fire('Error', 'Please fill in the details correctly', 'error');
        }
      });
    } else {
      Swal.fire('Validation Error', 'Please fill out all required fields', 'warning');
    }
  }

  // ***************************  POST/UPDATE DATA Gallary Details *********************
  // onGallary(): void {
  //   const formData = new FormData();

  //   for (let i = 0; i < this.selectedFiles.length; i++) {
  //     formData.append('photos', this.selectedFiles[i]);
  //   }
  //   this.service.postgallary(formData).subscribe(
  //     (response) => {
  //       // console.log('Upload successful', response);
  //       Swal.fire('Ohh...!', 'Photos Added Successfully..!', 'success');
  //     },

  //     (error) => {
  //       // console.error('Upload failed', error);
  //       Swal.fire('Error', 'Please fill the details', 'error');
  //     }
  //   );
  // }

  // async onFileSelected(event: any): Promise<void> {
  //   const file = event.target.files[0];

  //   if (!file) return;

  //   if (file.size > this.maxFileSizeMB * 1024 * 1024) {
  //     Swal.fire('File Too Large', `The file is too large. Please upload an image smaller than ${this.maxFileSizeMB} MB.`, 'error');
  //     return;
  //   }

  //   if (!this.allowedFileTypes.includes(file.type)) {
  //     Swal.fire('Invalid Format', 'Unsupported file format. Please upload a JPG, JPEG, or PNG image.', 'error');
  //     return;
  //   }

  //   try {
  //     const compressionOptions = {
  //       maxSizeMB: 5,
  //       maxWidthOrHeight: 1000,
  //       useWebWorker: true,
  //     };
  //     const compressedFile = await imageCompression(file, compressionOptions);

  //     // Convert to AVIF or WebP
  //     const convertedFile = await this.convertImageFormat(compressedFile, 'image/webp'); // Change to 'image/avif' for AVIF format

  //     console.log('Original file size:', file.size / 1024 / 1024, 'MB');
  //     console.log('Compressed file size:', compressedFile.size / 1024 / 1024, 'MB');
  //     console.log('Converted file size:', convertedFile.size / 1024 / 1024, 'MB');

  //     this.selectedFiles = [convertedFile];

  //     // Preview the new image
  //     this.imageObjectURL = URL.createObjectURL(convertedFile);

  //   } catch (error) {
  //     console.error('Error during compression or conversion:', error);
  //     Swal.fire('Error', 'There was an error processing the image. Please try again.', 'error');
  //   }
  // }


  // async convertImageFormat(file: File, format: string): Promise<File> {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const img = new Image();
  //       img.onload = () => {
  //         const canvas = document.createElement('canvas');
  //         const ctx = canvas.getContext('2d')!;

  //         canvas.width = img.width;
  //         canvas.height = img.height;
  //         ctx.drawImage(img, 0, 0);

  //         canvas.toBlob(
  //           (blob) => {
  //             if (blob) {
  //               const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, '') + `.${format.split('/')[1]}`, {
  //                 type: format,
  //                 lastModified: Date.now(),
  //               });
  //               resolve(newFile);
  //             } else {
  //               reject(new Error('Canvas conversion failed.'));
  //             }
  //           },
  //           format, 0.9);
  //       };
  //       img.onerror = (err) => {
  //         reject(new Error('Error loading image for conversion: ' + err));
  //       };
  //       img.src = e.target?.result as string;
  //     };
  //     reader.onerror = (err) => {
  //       reject(new Error('Error reading file: ' + err));
  //     };
  //     reader.readAsDataURL(file);
  //   });
  // }
 

onGallary(): void {
  if (this.compressedFiles.length === 0) {
    Swal.fire('Error', 'No files selected.', 'error');
    return;
  }

  const formData = new FormData();

  for (const file of this.compressedFiles) {
    formData.append('photos', file);
  }

  this.service.postgallary(formData).subscribe(
    (response) => {
      Swal.fire('Ohh...!', 'Photos Added Successfully..!', 'success');
    },
    (error) => {
      Swal.fire('Error', 'Failed to upload photos. Please try again.', 'error');
    }
  );
}

async onFileSelected(event: any): Promise<void> {
  const files = event.target.files;

  if (!files || files.length === 0) return;

  this.selectedFiles = []; // Clear previous selection
  this.compressedFiles = [];
  this.imageObjectURLs = [];

  for (const file of files) {
    if (file.size > this.maxFileSizeMB * 1024 * 1024) {
      Swal.fire('File Too Large', `The file ${file.name} is too large. Please upload an image smaller than ${this.maxFileSizeMB} MB.`, 'error');
      continue;
    }

    if (!this.allowedFileTypes.includes(file.type)) {
      Swal.fire('Invalid Format', `The file ${file.name} has an unsupported format. Please upload a JPG, JPEG, or PNG image.`, 'error');
      continue;
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

      this.selectedFiles.push(file);
      this.compressedFiles.push(convertedFile);

      // Preview the new image
      this.imageObjectURLs.push(URL.createObjectURL(convertedFile));
    } catch (error) {
      console.error('Error during compression or conversion:', error);
      Swal.fire('Error', `There was an error processing the file ${file.name}. Please try again.`, 'error');
    }
  }
}

// async onFileSelected(event: any): Promise<void> {
//   const file = event.target.files[0];

//   if (!file) return;

//   // Ensure trainer's name and last name are available
//   const trainerName = this.myForm.get("f_Name")?.value.trim().replace(/\s+/g, '_');
//   const trainerLastName = this.myForm.get("l_Name")?.value.trim();
//   if (!trainerName || !trainerLastName) {
//     Swal.fire('Error', 'Trainer name or last name is missing. Please ensure both fields are filled.', 'error');
//     return;
//   }

//   // Check if the file size exceeds the limit
//   if (file.size > this.maxFileSizeMB * 1024 * 1024) {
//     Swal.fire('File Too Large', `The file is too large. Please upload an image smaller than ${this.maxFileSizeMB} MB.`, 'error');
//     return;
//   }

//   // Check if the file type is valid
//   if (!this.allowedFileTypes.includes(file.type)) {
//     Swal.fire('Invalid Format', 'Unsupported file format. Please upload a JPG, JPEG, or PNG image.', 'error');
//     return;
//   }

//   try {
//     const compressionOptions = {
//       maxSizeMB: 5,
//       maxWidthOrHeight: 1000,
//       useWebWorker: true,
//     };

//     // Compress the image
//     const compressedFile = await imageCompression(file, compressionOptions);

//     // Convert the compressed image to the desired format (e.g., WebP)
//     const convertedFile = await this.convertImageFormat(compressedFile, 'image/webp');

//     // Create a new file name
//     const fileExtension = convertedFile.name.split('.').pop();
//     const newFileName = `${trainerName}_${trainerLastName}.${fileExtension}`;

//     // Create a new File object with the updated name
//     const renamedFile = new File([convertedFile], newFileName, {
//       type: convertedFile.type,
//       lastModified: Date.now(),
//     });

//     // Assign the renamed file to an array for multiple previews
//     this.selectedFiles = [renamedFile];

//     // Preview the renamed image
//     this.imageObjectURLs = [URL.createObjectURL(renamedFile)];

//     // Log file details (optional)
//     console.log('Original file size:', file.size / 1024 / 1024, 'MB');
//     console.log('Compressed file size:', compressedFile.size / 1024 / 1024, 'MB');
//     console.log('Converted file size:', convertedFile.size / 1024 / 1024, 'MB');
//     console.log('Renamed file:', renamedFile);

//   } catch (error) {
//     console.error('Error during compression or conversion:', error);
//     Swal.fire('Error', 'There was an error processing the image. Please try again.', 'error');
//   }
// }




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
          format,
          0.9
        );
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
