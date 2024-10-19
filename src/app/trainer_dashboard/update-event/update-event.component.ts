import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/common_service/admin.service';
import { TrainerService } from 'src/app/common_service/trainer.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.component.html',
  styleUrls: ['./update-event.component.css']
})
export class UpdateEventComponent implements OnInit {

  _id: any;
  uploadform!: FormGroup;
  showCategorydata:any[]=[];
  event_thumbnail : File | null = null;


  constructor(
    private router: ActivatedRoute, 
    private service: TrainerService, 
    private formb: FormBuilder,
    private route:Router,
    private admin:AdminService
  ) {  
    this._id = this.router.snapshot.paramMap.get('_id');
  }

  ngOnInit() {

    this.admin.getcategorydata().subscribe( data =>{
      // console.log("data",data)
      this.showCategorydata = data;
    });

    this.uploadform = this.formb.group({
      _id: [''],
      event_name:['', Validators.required],
      event_type:['',Validators.required],
      event_categories:['',Validators.required],
      event_start_time:['',Validators.required],
      event_end_time:['',Validators.required],
      event_location:['',Validators.required],
      estimated_seats:['',Validators.required],
      event_languages:['',Validators.required],
      event_info:['',Validators.required],
      event_description:['',Validators.required],
      event_thumbnail:['',Validators.required],


    });


    this.service.geteventbyID(this._id).subscribe((d:any) => {
      console.log('event data:', d);
      this.uploadform.patchValue({
        _id: d._id,
        event_name:d.event_name,
        event_type:d.event_type,
        event_categories:d.event_categories,
        event_start_time:d.event_start_time,
        event_location:d.event_location,
      estimated_seats:d.estimated_seats,
      event_languages:d.event_languages,
      event_info:d.event_info,
      event_description:d.event_description,
        event_end_time:d.event_end_time,        
      });
      this.event_thumbnail = d.event_thumbnail;
    });
  }


  onFileSelected(event: any): void {
    this.event_thumbnail = event.target.files[0];
  }


  onSubmit() {
    const formData = new FormData();
    formData.append('event_name',this.uploadform.get('event_name')?.value);
    formData.append('event_type',this.uploadform.get('event_type')?.value);
    formData.append('event_categories',this.uploadform.get('event_categories')?.value);
    formData.append('event_start_time',this.uploadform.get('event_start_time')?.value);
    formData.append('event_end_time',this.uploadform.get('event_end_time')?.value);  
    formData.append('event_location',this.uploadform.get('event_location')?.value);  
    formData.append('estimated_seats',this.uploadform.get('estimated_seats')?.value);  
    formData.append('event_languages',this.uploadform.get('event_languages')?.value);  
    formData.append('event_info',this.uploadform.get('event_info')?.value);  
    formData.append('event_description',this.uploadform.get('event_description')?.value);  

    if (this.event_thumbnail) {
      formData.append('event_thumbnail', this.event_thumbnail);
    }

    this.service.UpdateEventbyID(this._id, formData).subscribe({
      next: (response) => {
        console.log('Response:', response);
        Swal.fire('Success', 'Course updated successfully!', 'success');
        // this.route.navigate(['/trainer/event']);
      },
      error: error => {
        console.error('Update failed', error);
        Swal.fire('Error', 'Error updating course.', 'error');
      }
    });
  }

}
