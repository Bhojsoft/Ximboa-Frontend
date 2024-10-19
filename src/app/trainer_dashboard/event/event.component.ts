import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/common_service/admin.service';
import { AuthServiceService } from 'src/app/common_service/auth-service.service';
import { TrainerService } from 'src/app/common_service/trainer.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent  implements OnInit{

  showeventdata:any;
  showCategorydata:any;
  selectedFile: File | null = null;


  showIcon = false;
  toggleIcon() {
    this.showIcon = !this.showIcon;
  }

  isUser: boolean = true; 
  isTrainer: boolean = false;
  isSELF_EXPERT: boolean = false;
  isInstitute : boolean = false;
  isAdmin : boolean = false;


  checkUserRole() {
    const role = this.auth.getUserRole();
    this.isTrainer = role === 'TRAINER';
    this.isSELF_EXPERT = role === 'SELF_EXPERT';
    this.isInstitute = role === 'INSTITUTE';
    this.isAdmin = role === 'SUPER_ADMIN';
    this.isUser = role === 'USER'  || role === 'TRAINER' || role === 'SELF_EXPERT' || role === 'INSTITUTE' || role === 'SUPER_ADMIN' ;
  }

  event = {
    event_name: ' ',
    event_type: ' ',
    event_category: ' ',
    event_info:'',
    event_description:' ',
    event_date:' ',
    event_start_time: ' ',
    event_end_time: ' ',
    event_location:' ',
     event_languages: '',
    estimated_seats:' ',

    event_thumbnail:null,
  };

  constructor(private service:TrainerService, private admin:AdminService, private auth: AuthServiceService){}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  ngOnInit(): void {
      
    this.checkUserRole();

      this.service.gettrainerdatabyID().subscribe(data=>{
        // console.log(data);
        this.showeventdata = data.eventsWithThumbnailUrl;
      });

      this.admin.getcategorydata().subscribe( data =>{
        // console.log("data",data)
        this.showCategorydata = data;
      });
  }

  
  onSubmit() {
    const formData = new FormData();
    formData.append('event_name', this.event.event_name.trim());
    formData.append('event_type', this.event.event_type.trim());
    formData.append('event_category', this.event.event_category.trim());
    formData.append('event_info', this.event.event_info.trim());
    formData.append('event_description', this.event.event_description.trim());
    formData.append('event_date', this.event.event_date.trim());
    formData.append('event_start_time', this.event.event_start_time.trim());
    formData.append('event_end_time', this.event.event_end_time.trim());
    formData.append('event_location', this.event.event_location.trim());
    formData.append('event_languages', this.event.event_languages.trim());
    formData.append('estimated_seats', this.event.estimated_seats.trim());

  
    if (this.selectedFile) {
      formData.append('event_thumbnail', this.selectedFile, this.selectedFile.name);
    }
  
    this.service.AddEvent(formData).subscribe({
      next: (response) => {
        Swal.fire('Ohh...!', 'Event Added Successfully..!', 'success');
        window.location.reload();
      },
      error: (error) => {
        console.error("Error:", error);
        Swal.fire('Error', `Please fill the details. ${error.message}`, 'error');
      }
    });
  }
  
  

  onDelete(id: string): void {
    this.service.deleteEvent(id).subscribe(
      response => {
        // console.log('Data deleted successfully', response);
        alert("Event deleted successfully");
        window.location.reload();
      },
      error => {
        // console.error('Error deleting data', error);
        alert("Error");
      }
    );

  }
}
