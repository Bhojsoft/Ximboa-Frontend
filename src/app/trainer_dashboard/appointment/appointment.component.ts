import { Component, OnInit } from '@angular/core';
import { TrainerService } from 'src/app/common_service/trainer.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {

      showAppointmentData : any;
      p: number = 1;
      totalItems = 0;
      currentPage = 1;
      itemsPerPage = 10;
      
      constructor(private service:TrainerService){}

      ngOnInit(): void {
          
        this.loadAllAppointment(this.currentPage, this.itemsPerPage);
      }


      loadAllAppointment(page: number, limit: number){
        this.service.GetAppointment(page, limit).subscribe(data =>{
          this.showAppointmentData = data.data;
          console.log("apmt",data);
          
          this.totalItems = data.pagination.totalItems;
        })
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
            this.service.deleteAppointmentbyID(id).subscribe(
              response => {
                Swal.fire('Deleted!','The course has been deleted successfully.','success' );
                this.loadAllAppointment(this.currentPage, this.itemsPerPage);
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



      onPageChange(page: number): void {
        this.currentPage = page;
        this.p = page;
        this.loadAllAppointment(this.currentPage, this.itemsPerPage); 
      }
}
